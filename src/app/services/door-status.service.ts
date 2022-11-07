//#region Imports
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DoorStatus } from '@model/door-status';
import { config } from '@environment/config';
//#endregion

@Injectable({
  providedIn: 'root'
})
export class DoorStatusService {
  private url = `${config.utilityApiUrl}/inout/doorstatus`;

  constructor(private http: HttpClient) { }

  getStatus(sAMAccountName: string): Observable<DoorStatus> {
    return this.http.get<DoorStatus>(`${this.url}/${sAMAccountName}`);
  }
}
