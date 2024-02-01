//#region Imports
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { interval } from 'rxjs';
import { DateTime } from 'luxon';
import { environment } from '@environment/environment';
import { User } from '@cleavelandprice/ngx-lib/active-directory';

import { DirectoryEntry } from '@model/directory-entry';
import { AppointmentQuery } from '@model/appointment-query';
import { InOutStatus } from '@model/in-out-status';
import { RoomsService } from '@services/rooms.service';
import { DefaultQueryService } from '@services/default-query.service';
//#endregion

@Component({
  selector: 'cp-room-selector',
  templateUrl: './room-selector.component.html',
  styleUrls: ['./room-selector.component.css']
})
export class RoomSelectorComponent implements OnInit {
  //#region Fields
  @Input() showMenu: boolean;
  @Input() inOutStatus: InOutStatus;
  @Output() menuShown = new EventEmitter();
  @Output() gotQuery = new EventEmitter<AppointmentQuery>();
  rooms: User[];
  selectedRoom: User;
  password: string;
  startDate = DateTime.now().startOf('day');
  includeEnded = false;
  includeDoorStatus: boolean;
  //#endregion

  //#region Lifecycle
  constructor(public dialog: MatDialog,
              private roomsService: RoomsService,
              private defaultQueryService: DefaultQueryService) {}

  ngOnInit() {
    this.monitorDayChanges();

    this.roomsService.get()
      .subscribe(rooms => {
        this.rooms = rooms;

        // During the last request to get appointments, we saved the query in local storage
        // Pull those values and default to the previous selections, then grab the appointments
        const query = localStorage.getItem('query');
        if (query) {
          const q = JSON.parse(query) as AppointmentQuery;

          this.password = q.pw;
          this.includeEnded = q.includeEnded || false;
          this.includeDoorStatus = q.includeDoorStatus || false;

          // Select the room so the drop-down list updates
          this.selectedRoom = this.rooms.find(room => room.sAMAccountName === q.room.sAMAccountName);

          this.emitQuery();
        } else {
          console.log("Query not found in local storage");
          this.getDefaultQuery();
        }

        // If there was a query stored in localStorage from last time, hide the menu by default
        this.showMenu = query === null;
      });
  }
  //#endregion

  //#region Utilities
  emitQuery(): void {
    const query: AppointmentQuery = {
      room: this.selectedRoom,
      userName: this.selectedRoom.sAMAccountName,
      pw: this.password,
      rangeStart: this.startDate.toISO(),
      includeEnded: this.includeEnded,
      includeDoorStatus: this.includeDoorStatus
    };

    // Save the query in localStorage
    localStorage.setItem('query', JSON.stringify(query));

    this.gotQuery.emit(query);
    this.showMenu = false;
  }

  private monitorDayChanges(): void {
    interval(environment.dayChangeRefreshMs).subscribe(() => {
      // Did the day just change?  If so, change the startDate value
      const today = DateTime.now().startOf('day');
      if (today > this.startDate && today.hour === 0) {
        console.log(today, 'Adjusting date for new day...');
        this.startDate = today;
        this.emitQuery();
      }
    });
  }

  private getDefaultQuery(): void {
    this.defaultQueryService.getQuery()
      .subscribe(query => {
        if (!query) {
          console.warn("No default query config found in API!");
          return;
        }

        console.log("Got default query config from API");

        this.includeEnded = query.includeEnded;
        this.includeDoorStatus = query.includeDoorStatus;
        this.selectedRoom = this.rooms.find(room => room.sAMAccountName === query.room.sAMAccountName);
        this.emitQuery();

        this.showMenu = false;
      });
  }

  stripInvalidChars(raw: string): string {
    if (!raw) { return; }

    return raw.replace(/\0/g, '');
  }
  //#endregion
}
