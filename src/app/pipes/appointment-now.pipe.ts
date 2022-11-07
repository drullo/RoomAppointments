import { CalendarEvent } from '@model/calendar-event';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appointmentNow'
})
export class AppointmentNowPipe implements PipeTransform {

  transform(appointments: CalendarEvent[]): boolean {
    return appointments && appointments.filter(a => a.isHappeningNow).length > 0;
  }
}