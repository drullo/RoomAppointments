import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { config } from '@environment/config';
import { secret } from '@environment/secret';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private http = inject(HttpClient);
  private url = `${config.utilityApiUrl}/graph/calendars`;
  private headers = new HttpHeaders()
    .set('secret', secret);

  getTodayEvents(account: string, includeEnded: boolean): Observable<any> {
    return this.http.get<any>(`${this.url}/${account}/today/${includeEnded}`,
      {'headers': this.headers});
  }

  getEventsOn(account: string, date: string, includeEnded: boolean) {
    var formattedDate = date.replace(/\//g, '-');
    return this.http.get<any>(`${this.url}/${account}/on/${formattedDate}/${includeEnded}`,
      {'headers': this.headers});
  }
}