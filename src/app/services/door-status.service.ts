import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { config } from '@environment/config';
import { DoorStatus } from '@model/door-status';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoorStatusService {
  private http = inject(HttpClient);
  private url = `${config.utilityApiUrl}/inout/doorstatus`;

  getStatus(sAMAccountName: string): Observable<DoorStatus> {
    return this.http.get<DoorStatus>(`${this.url}/${sAMAccountName}`);
  }
}