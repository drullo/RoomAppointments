import { Injectable } from '@angular/core';
import { timer } from 'rxjs';
import * as moment from 'moment';
import { LoggingService } from '@services/logging.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  recentErrors: {sAMAccountName: string, errorType: string, time: moment.Moment}[] = [];

  constructor(private loggingService: LoggingService) { }

  sendError(errorType: string, sAMAccountName: string, error: any): void {
    console.log(`${errorType} error`, error);

    this.clearOldErrors();

    // Avoid sending repeat errors within a certain timespan
    if (this.isRepeatError(sAMAccountName, errorType)) { return; }

    // Keep track of this error to avoid sending repeats of it in subsequent calls
    this.recentErrors.push({ sAMAccountName, errorType, time: moment() });

    // Wait 10 sends to allow any potential network hickups to (hopefully) resume
    timer(10000)
      .subscribe(() => {
        this.loggingService.log.error("{ErrorType} error from room info app on {AccountName}. Status={ErrorStatus}, StatusText={ErrorStatusText}, URL={Url}", errorType, sAMAccountName, error.status, error.statusText, error.url);
      });
  }

  private clearOldErrors(): void {
    const cutOff = moment().add(-1, 'hours');

    // Seems like a better way
    this.recentErrors = this.recentErrors.filter(e => e.time.isAfter(cutOff));
  }

  private isRepeatError(sAMAccountName: string, errorType: string): boolean {
    return !!this.recentErrors.find(e => e.errorType === errorType && e.sAMAccountName === sAMAccountName);
  }
}