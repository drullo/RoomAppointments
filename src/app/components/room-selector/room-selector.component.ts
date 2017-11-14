import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { ExchangeService } from './../../services/exchange.service';

import 'rxjs/add/operator/take';

import { AppointmentQuery } from './../../models/appointment-query';

import * as moment from 'moment';

@Component({
  selector: 'room-selector',
  templateUrl: './room-selector.component.html',
  styleUrls: ['./room-selector.component.css']
})
export class RoomSelectorComponent implements OnInit {
  rooms: any[] = [];
  selectedRoom: any;
  lastCheckTime: Date;
  password: string;
  startDate = moment().startOf('day').toDate();
  selectedRoomAppointments: Observable<any>;
  includeEndedAppointments = false;

  automaticCheck: Subscription;
  automaticCheckMinutes = 15;

  constructor(private _exchange: ExchangeService) { }

  currentTime: Date;

  ngOnInit() {
    Observable.interval(1000)
      .subscribe(() => {
        this.currentTime = moment().toDate();
      }
      );

    this._exchange.getConferenceRooms()
      .take(1)
      .subscribe(rooms => {
        this.rooms = [];
        // this.rooms.push({ label: 'Select Room', value: null });

        for (const room of rooms) {
          this.rooms.push(room);
        }

        // During the last request to get appointments, we saved the query in local storage
        // Pull those values and default to the previous selections, then grab the appointments
        const query = localStorage.getItem('query');
        if (query) {
          const q = JSON.parse(query) as AppointmentQuery;

          this.password = q.pw;
          this.includeEndedAppointments = q.includeEnded;

          // Select the room so the drop-down list updates
          this.rooms.filter(room => room.sAMAccountName === q.userName)
            .forEach(room => this.selectedRoom = room.sAMAccountName);

          // Automatically get the appointments
          const val = {
            confRoom: q.userName,
            password: q.pw,
            includeEndedApppointments: q.includeEnded
          };

          this.getAppointments(val);
        }
      });
  }

  getAppointments(val) {
    /*if (!this.selectedRoom) {
      this.lastCheckTime = null;
      this.automaticCheck = null;
      return;
    }*/

    const query: AppointmentQuery = new AppointmentQuery;

    query.userName = val.confRoom; // this.selectedRoom.sAMAccountName;
    query.pw = val.password; // this.password;
    query.rangeStart = this.startDate.toLocaleDateString();
    query.includeEnded = val.includeEndedAppointments; // this.includeEndedAppointments;

    localStorage.setItem('query', JSON.stringify(query));

    this.selectedRoomAppointments = this._exchange.getAppointments(query);
    this.lastCheckTime = new Date(Date.now());

    if (!this.automaticCheck) {
      const checkIntervalMs = this.automaticCheckMinutes * 60 * 1000;

      this.automaticCheck = Observable.timer(checkIntervalMs, checkIntervalMs)
        .subscribe(t => {
          // Did the day just change?  If so, change the startDate value
          // "What if there is no tomorrow?  There wasn't one today." -Bill Murray, Groundhog Day
          const today = moment().startOf('day');
          const startDate = moment(this.startDate);
          if (today > startDate && today.hour() === 0) {
            console.log(today, 'Adjusting date for new day...');
            this.startDate = today.toDate();
          }

          this.getAppointments(val);
        });
    }
  }

  roomSelected() {
    this.selectedRoomAppointments = null;
    this.lastCheckTime = null;
    this.automaticCheck = null;
  }

  setLocalDate($event) {
    // This is a fix for a timezone bug...
    // When you select a date, the calendar sets it to one day prior
    // The PrimeNG forum and Github has several bugs submitted for this and apparently it's been going on for a while.
    // It was reported to be fixed, but apparently is not.
    $event.setTime($event.getTime() + (new Date().getTimezoneOffset() * 60 * 1000));
    this.startDate = $event;
  }
}
