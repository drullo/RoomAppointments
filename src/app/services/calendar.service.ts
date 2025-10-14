import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output, inject } from '@angular/core';
import { config } from '@environment/config';
//import { secret } from '@environment/secret';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  @Output() gotMSGraphSecret = new EventEmitter();
  private http = inject(HttpClient);
  private url = `${config.utilityApiUrl}/graph/calendars`;
  //private headers = new HttpHeaders().set('secret', secret);
  private headers: HttpHeaders;

  constructor() {
    // Get the MS Graph secret for all subsequent calls
    this.http.get(`${config.utilityApiUrl}/users/pw/${config.utilityApiUser}`, { responseType: 'text' })
      .subscribe(secret => {
        this.headers = new HttpHeaders().set('secret', secret);
        this.gotMSGraphSecret.emit();
    });
  }

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