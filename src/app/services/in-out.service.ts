import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { config } from '@environment/config';
import { InOutStatus } from '@model/in-out-status';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InOutService {
  private http = inject(HttpClient);
  private url = `${config.utilityApiUrl}/inout/statuses`;

  getStatus(sAMAccountName: string): Observable<InOutStatus> {
    return this.http.get<InOutStatus>(`${this.url}/${sAMAccountName}`);
  }
}
