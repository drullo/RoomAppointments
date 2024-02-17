import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { config } from '@environment/config';
import { AppointmentQuery } from '@model/appointment-query';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DefaultQueryService {
  private http = inject(HttpClient);

  private url = `${config.utilityApiUrl}/roomappointmentsconfig`;

  getQuery(): Observable<AppointmentQuery> {
    return this.http.get<AppointmentQuery>(this.url);
  }
}