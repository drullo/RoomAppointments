import { Injectable } from '@angular/core';
import { DirectoryEntry } from '@model/directory-entry';

@Injectable()
export class AppointmentQuery {
    userName?: string;
    room: DirectoryEntry;
    pw?: string;
    rangeStart: string;
    rangeEnd?: string;
    includeEnded: boolean;
    includeDoorStatus?: boolean;
}