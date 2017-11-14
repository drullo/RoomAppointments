import { Injectable } from '@angular/core';

@Injectable()
export class AppointmentQuery {
    userName: string;
    pw: string;
    rangeStart: string;
    rangeEnd: string;
    includeEnded: boolean;
}