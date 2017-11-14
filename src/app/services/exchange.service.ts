import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

import { AppointmentQuery } from './../models/appointment-query';

@Injectable()
export class ExchangeService {
  _url: string = "http://webservices.price.local/api/exchange"

  constructor(private _http: HttpClient) { }

  getConferenceRooms(): Observable<any> {
    let url = `${this._url}/rooms`;
    
    return this._http.get(url)
      //.map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  getAppointments(query: AppointmentQuery): Observable<any> {
    let url = `${this._url}/appointments`;

    return this._http.post(url, query)
      //.map((response: Response) => response.json())
      .catch(this._errorHandler);
  }

  _errorHandler(error: Response): Observable<Error> {
    console.error(error);
    return Observable.throw(error || "Server error");
  }
}