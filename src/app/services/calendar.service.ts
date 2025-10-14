import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { config } from '@environment/config';
//import { secret } from '@environment/secret';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  #services = {
    http: inject(HttpClient),
    storage: inject(StorageService)
  }
  private url = `${config.utilityApiUrl}/graph/calendars`;
  //private headers = new HttpHeaders().set('secret', secret);

  getTodayEvents(account: string, includeEnded: boolean): Observable<any> {
    return this.#services.http.get<any>(`${this.url}/${account}/today/${includeEnded}`,
      {'headers': this.#services.storage.msGraphHeader});
  }

  getEventsOn(account: string, date: string, includeEnded: boolean) {
    var formattedDate = date.replace(/\//g, '-');
    return this.#services.http.get<any>(`${this.url}/${account}/on/${formattedDate}/${includeEnded}`,
      {'headers': this.#services.storage.msGraphHeader});
  }
}