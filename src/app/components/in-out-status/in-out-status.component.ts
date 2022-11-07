//#region Imports
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import {timer, onErrorResumeNext, Subscription } from 'rxjs';

import { environment } from '@environment/environment';
import { InOutService } from '@services/in-out.service';
import { InOutStatus } from '@model/in-out-status';
import { ErrorHandlerService } from '@services/error-handler.service';
//#endregion

@Component({
  selector: 'cp-in-out-status',
  templateUrl: './in-out-status.component.html',
  styleUrls: ['./in-out-status.component.css']
})
export class InOutStatusComponent implements OnInit, OnDestroy {
  //#region Fields
  @Input() sAMAccountName: string;
  @Output() gotInOutStatus = new EventEmitter<InOutStatus>();
  @Output() gotError = new EventEmitter();
  private refreshSubscription: Subscription;
  //#endregion

  //#region Lifecycle
  constructor(private inOutService: InOutService,
              private errorHandler: ErrorHandlerService) {}

  ngOnInit() {
    this.getStatus();
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
  //#endregion

  getStatus(): void {
    this.inOutService.getStatus(this.sAMAccountName)
      .subscribe((status: InOutStatus) => {
        this.gotInOutStatus.emit(status);
        this.gotError.emit(); // This actually clears the error
      },
      error => {
        this.gotError.emit({ error, type: 'InOut Status' });
        this.errorHandler.sendError('InOutStatus', this.sAMAccountName, error);
      });

    // If this is the first time, setup a subscription to automatically refresh
    if (!this.refreshSubscription) {
      this.refreshSubscription = onErrorResumeNext(
        timer(environment.inOutStatusRefreshMs, environment.inOutStatusRefreshMs)
      ).subscribe(() => this.getStatus());
    }
  }
}