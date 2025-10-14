import { Pipe, PipeTransform } from '@angular/core';
import { DirectoryEntry } from '@model/directory-entry';

@Pipe({
    name: 'roomIsPerson',
    standalone: false
})
export class RoomIsPersonPipe implements PipeTransform {
  // The app now allows certain users (managers) to be treated as conference rooms
  // This is due to Rob Ross's request to have a display outside of his office showing his availability

  transform(room: DirectoryEntry): boolean {
    if (!room) { return false; }

    return room.distinguishedName.toLowerCase().indexOf('cp users') !== -1;
  }

}
