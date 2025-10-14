import { Component, OnInit, inject } from '@angular/core';
import { environment } from '@environment/environment';
import { AppointmentQuery } from '@model/appointment-query';
import { DoorStatus } from '@model/door-status';
import { InOutStatus } from '@model/in-out-status';
import { CalendarService } from '@services/calendar.service';
import { VersionService } from '@services/version.service';

@Component({
    selector: 'cp-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit {
  #versionService = inject(VersionService);
  #calendarService = inject(CalendarService);

  //#region Fields
  query: AppointmentQuery;
  lastCheckTime: Date;
  showMenu: boolean;
  inOutStatus: InOutStatus;
  doorStatus: DoorStatus;
  isPerson: boolean;
  error: any;
  errorType: string;
  errorTime: Date;
  #doorError: any;
  #inOutError: any;
  //#endregion

  ngOnInit(): void {
    // Need MS Graph secret before things can proceed
    this.#calendarService.gotMSGraphSecret
      .subscribe(() => this.#versionService.checkVersion());
  }
  
  //#region Utilities
  gotQuery(query: AppointmentQuery): void {
    this.query = query;

    if (!this.query.includeDoorStatus) {
      this.doorStatus = null;
    }

    // Is it for a person?
    const regExp = new RegExp(environment.aDPeopleGroup, 'i');

    this.isPerson = this.query.room.memberOf &&
    (
      (
        typeof(this.query.room.memberOf) === 'string' &&
        (this.query.room.memberOf as string).match(regExp) !== null
      ) ||
      (
        typeof(this.query.room.memberOf) === 'object' &&
        this.query.room.memberOf.filter(m => m.match(regExp)).length > 0
      )
    );
  }

  gotAppointments(): void {
    this.lastCheckTime = new Date();
  }

  gotDoorError(error: any): void {
    this.#doorError = error ? error.error : null; // If null, it will clear a previous error

    if (this.#inOutError) {
      return; // So we don't step on it
    }

    // There's no existing InOut error to step on, so set the real error to this one
    this.error = error ? error.error : null;
    this.errorType = error ? error.type : null;
    this.errorTime = error ? new Date() : null;
  }

  gotInOutError(error: any): void {
    this.#inOutError = error ? error.error : null; // If null, it will clear a previous error

    if (this.#doorError) {
      return; // So we don't step on it
    }

    // There's no existing Door error to step on, so set the real error to this one
    this.error = error ? error.error : null;
    this.errorType = error ? error.type : null;
    this.errorTime = error ? new Date() : null;
  }
  //#endregion
}