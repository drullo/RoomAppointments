import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from '@environment/config';
import { AppointmentQuery } from '@model/appointment-query';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DefaultQueryService {
  private url = `${config.utilityApiUrl}/roomappointmentsconfig`;

  constructor(private http: HttpClient) { }

  getQuery(): Observable<AppointmentQuery> {
    return this.http.get<AppointmentQuery>(this.url);
  }
}
