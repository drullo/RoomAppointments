//#region Imports
import { Component, OnDestroy, OnChanges, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import {timer, onErrorResumeNext, Subscription, forkJoin } from 'rxjs';

import { environment } from '@environment/environment';

import { CleavelandPriceUser, ActiveDirectoryService } from '@cleavelandprice/ngx-lib/active-directory';
import { PhotoItem, SharePointService } from '@cleavelandprice/ngx-lib/sharepoint';

import { AppointmentQuery } from '@model/appointment-query';
import { InOutStatus } from '@model/in-out-status';
import { DoorStatus } from '@model/door-status';
import { PhotoService } from '@services/photo.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CalendarService } from '@services/calendar.service';
import { Attendee, CalendarEvent } from '@model/calendar-event';
import { ErrorHandlerService } from '@services/error-handler.service';
//#endregion

@Component({
  selector: 'cp-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnDestroy, OnChanges {
  //#region Fields
  @Input() query: AppointmentQuery;
  @Input() inOutStatus: InOutStatus;
  @Input() doorStatus: DoorStatus;
  @Input() isPerson: boolean;
  @Input() error: any; // Can be set from this component, or fed from DoorStatus/InOutStatus
  @Input() errorType: string; // Can be set from this component, or fed from DoorStatus/InOutStatus
  @Input() errorTime: Date; // Can be set from this component, or fed from DoorStatus/InOutStatus
  @Output() gotAppointments = new EventEmitter();

  appointments: CalendarEvent[];
  //photos: Photo[];
  photos: PhotoItem[];
  photoBlobs: { emailAddress: string; blob: any; }[] = [];
  //employees: Employee[];
  employees: CleavelandPriceUser[];
  showErrorDetails: boolean;

  private refreshSubscription: Subscription;
  //#endregion

  //#region Properties
  get nextAppointment(): CalendarEvent {
    if (!this.appointments || !this.appointments.length) { return; }

    const appointments = this.appointments.filter(a => !a.isHappeningNow);
    return appointments.length ? appointments[0] : null;
  }
  //#endregion

  //#region Lifecycle
  constructor(private calendarService: CalendarService,
              private activeDirectoryService: ActiveDirectoryService,
              private sharePointService: SharePointService,
              private photoService: PhotoService,
              private sanitizer: DomSanitizer,
              private errorHandler: ErrorHandlerService) { }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.query && changes.query.previousValue !== changes.query.currentValue) {
      this.getData();
    }
  }
  //#endregion

  private getData(): void {
    if (!(this.query && this.query.room)) { return; }

    // Re-initialize
    this.error = null;

    forkJoin([
      //this.employeeService.get(),
      this.activeDirectoryService.getUsers(),
      //this.photoService.getPhotos(),
      this.sharePointService.getPhotos(),
      //this.exchangeService.getAppointments(this.query)
      this.calendarService.getEventsOn(this.query.userName, this.query.rangeStart, this.query.includeEnded)
    ]).subscribe(([ users, photos, appointments ]) => {

      this.ConfigureAppointments(appointments);

      //this.employees = employees;
      this.employees = users;
      this.stripNonEmployees(this.appointments);

      this.photos = photos;
      this.getPhotoContent(); // For the current set of appointments;

      // If this is the first time, setup a subscription to automatically refresh
      if (!this.refreshSubscription) {
        const checkIntervalMs = this.isPerson ?
          environment.peopleAppointmentsRefreshMs :
          environment.roomAppointmentsRefreshMs;

        this.refreshSubscription = onErrorResumeNext(timer(checkIntervalMs, checkIntervalMs))
          .subscribe(() => this.getData());
      }

      }, error => {
        this.error = error;
        this.errorTime = new Date();
        this.errorType = 'Appointments';
        this.appointments = null;
        this.errorHandler.sendError('Appointments', this.query.userName, error);
      });
  }

  private ConfigureAppointments(appointments: CalendarEvent[]): void {
    const busyTypes = [ 'busy', 'oof' ];
    const filteredAppointments = appointments
      .filter(appointment => busyTypes.indexOf(appointment.showAs.toLowerCase()) !== -1);

    this.stripOrganizerFromAttendees(filteredAppointments);
    this.stripNonEmployees(filteredAppointments);

    const appointmentsDiffer = !this.appointments ||
      this.appointments.length !== filteredAppointments.length ||
      JSON.stringify(this.appointments) !== JSON.stringify(filteredAppointments);

    if (!appointmentsDiffer) { return; }

    this.appointments = filteredAppointments;
    this.stripOrganizerFromAttendees(this.appointments);
    this.stripNonEmployees(this.appointments);

    this.gotAppointments.emit();
  }

  //#region Utilities
  private stripOrganizerFromAttendees(appointments: CalendarEvent[]): void {
    appointments.forEach(appointment => {
      if (!appointment.organizer.emailAddress?.address) { return; }

      appointment.attendees = appointment.attendees
        .filter(a => !a.emailAddress?.address || a.emailAddress.address !== appointment.organizer.emailAddress.address);
    });
  }

  /* If a distribution group (such as 'ITDev') is used to add attendees to a meeting,
      that group is listed as an attendee.
  */
  private stripNonEmployees(appointments: CalendarEvent[]): void {
    if (!appointments || !this.employees) { return; }

    const empAddresses = this.employees
      .filter(emp => emp.mail)
      .map(emp => emp.mail.toLowerCase());

    appointments.forEach(appointment => {
      // But first... we need to expand any distribution lists and manually add attendees that belong to that list
      //this.expandDistributionLists(appointment);
      this.expandDistributionList(appointment.attendees);

      appointment.attendees = appointment.attendees
        .filter(a => !a.emailAddress || empAddresses.indexOf(a.emailAddress?.address?.toLowerCase()) !== -1);
    });
  }

  private expandDistributionList(attendeeList: Attendee[]): void {
    attendeeList.forEach(possibleDL => {

      const possibleDLEmp = this.employees
        .filter(user => user.mail)
        .find(user => user.mail === possibleDL.emailAddress?.address);

      if (possibleDLEmp) { return; } // This is a regular employee (because they're in the list)

      // No employee found matching this attendee.  That might mean that this is a distribution list

      // Now sort through each employee and determine if they belong to a group that matches the name of possibleDL
      this.employees.forEach(user => {
        user.memberOf.forEach(group => {
          const groupSplit = group.split(',');

          groupSplit
            .filter(part => part.toLowerCase().startsWith('cn=')) // Grab the Canonical Name portion of the distinguishedName
            .map(part => part.split('=')[1])
            .forEach(part => {
              if (part === possibleDL.emailAddress.name) {
                // We found a match - this employee belongs to a group that matches the attendee name
                // Manually add the employee to the list of attendees
                attendeeList.push({
                  emailAddress: {
                    address: user.mail,
                    name: user.displayName
                  },
                  proposedNewTime: {
                    end: possibleDL.proposedNewTime?.end,
                    start: possibleDL.proposedNewTime?.start
                  },
                  status: {
                    response: possibleDL.status?.response,
                    time: possibleDL.status?.time
                  },
                  type: possibleDL.type
                });
              }
            });
        });
      });
    });
  }
  //#endregion

  private getPhotoContent(): void {
    if (!(this.appointments && this.employees && this.photos)) { return; }

    this.appointments
      .filter(a => a.organizer.emailAddress)
      .forEach(appointment => {
        this.addPhotoForEmp(appointment.organizer.emailAddress.address);
        
        appointment.attendees?.forEach(a => this.addPhotoForEmp(a.emailAddress.address));
      });
  }

  private addPhotoForEmp(emailAddress: string): void {
    if (!emailAddress) { return; }

    const employee = this.employees
      .find(e => e.mail?.toLowerCase() === emailAddress.toLowerCase());

    if (!employee) { return; }

    const photoBlob = this.photoBlobs
      .find(b => b.emailAddress === employee.mail);

    if (!photoBlob) {
        // Photo blob not in array yet
        const photo = this.photos
          .find(p =>
            (employee.employeeNumber && p.employeeNumber === +employee.employeeNumber) ||
            p.accountName?.toLowerCase() === employee.sAMAccountName?.toLowerCase() ||
            p.displayName?.toLowerCase() === employee.displayName?.toLowerCase());
        
        if (photo) {
          this.photoService.getPhotoContent(photo.encodedAbsUrl)
            .subscribe(blob =>
              this.addPhotoBlobToArray(blob.body, employee.mail)
            );
        }
    }
  }

  private addPhotoBlobToArray(image: Blob, emailAddress: string) {
    let reader = new FileReader();
    
    reader.addEventListener("load", () =>
      this.photoBlobs.push({
        emailAddress,
        blob: reader.result
      })
    , false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  photoBlob(emailAddress: string) {
    const blob = this.photoBlobs
      .find(b => b.emailAddress?.toLowerCase() === emailAddress.toLowerCase());

    return blob ?
      this.sanitizer.bypassSecurityTrustUrl(blob.blob) :
      null;
  }

  requiredAttendees(appointment: CalendarEvent): Attendee[] {
    return appointment.attendees.filter(a => a.type === 0);
  }

  optionalAttendees(appointment: CalendarEvent): Attendee[] {
    return appointment.attendees.filter(a => a.type === 1);
  }
}