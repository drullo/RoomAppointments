//#region Imports
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { InOutStatus } from '@model/in-out-status';
import { Observable } from 'rxjs';
import { config } from '@environment/config';
//#endregion

@Injectable({
  providedIn: 'root'
})
export class InOutService {
  private url = `${config.utilityApiUrl}/inout/statuses`;

  constructor(private http: HttpClient) { }

  getStatus(sAMAccountName: string): Observable<InOutStatus> {
    return this.http.get<InOutStatus>(`${this.url}/${sAMAccountName}`);
  }
}
