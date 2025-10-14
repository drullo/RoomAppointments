import { CalendarEvent } from '@cleavelandprice/ngx-lib/msgraph';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'appointmentNow',
    standalone: false
})
export class AppointmentNowPipe implements PipeTransform {

  transform(appointments: CalendarEvent[]): boolean {
    return appointments && appointments.filter(a => a.isHappeningNow).length > 0;
  }
}