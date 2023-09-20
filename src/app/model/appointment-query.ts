import { Injectable } from '@angular/core';
import { User } from '@cleavelandprice/ngx-lib/active-directory';

@Injectable()
export class AppointmentQuery {
    userName?: string;
    room: User;
    pw?: string;
    rangeStart: string;
    rangeEnd?: string;
    includeEnded: boolean;
    includeDoorStatus?: boolean;
}