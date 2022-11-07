import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@cleavelandprice/ngx-lib/active-directory';
import { Observable } from 'rxjs';
import { config } from '@environment/config';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  constructor(private http: HttpClient) { }

  get(): Observable<User[]> {
    // the final parameter is includeConferenceRoomPeople
    return this.http.get<User[]>(`${config.utilityApiUrl}/users/rooms/true`);
  }
}
