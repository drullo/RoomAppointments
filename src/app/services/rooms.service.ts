import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User } from '@cleavelandprice/ngx-lib/active-directory';
import { config } from '@environment/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private http = inject(HttpClient);

  get(): Observable<User[]> {
    // the final parameter is includeConferenceRoomPeople
    return this.http.get<User[]>(`${config.utilityApiUrl}/users/rooms/true`);
  }
}
