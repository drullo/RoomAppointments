import { Pipe, PipeTransform } from '@angular/core';
import { InOutStatus } from '@model/in-out-status';

@Pipe({
  name: 'doorClosed'
})
export class DoorClosedPipe implements PipeTransform {

  transform(status: InOutStatus): boolean {
    return status && status.notes && status.notes.toLowerCase() === 'door closed';
  }
}
