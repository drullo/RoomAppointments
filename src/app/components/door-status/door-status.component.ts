
//#region Imports
import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import {timer, onErrorResumeNext, Subscription } from 'rxjs';

import { environment } from '@environment/environment';
import { DoorStatusService } from '@services/door-status.service';
import { DoorStatus } from '@model/door-status';
import { ErrorHandlerService } from '@services/error-handler.service';
//#endregion

@Component({
  selector: 'cp-door-status',
  templateUrl: './door-status.component.html',
  styleUrls: ['./door-status.component.css']
})
export class DoorStatusComponent implements OnInit, OnDestroy {
  //#region Fields
  @Input() sAMAccountName: string;
  @Output() gotDoorStatus = new EventEmitter<DoorStatus>();
  @Output() gotError = new EventEmitter();
  private refreshSubscription: Subscription;
  //#endregion

  //#region Lifecycle
  constructor(private doorService: DoorStatusService,
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
    this.doorService.getStatus(this.sAMAccountName)
      .subscribe((status: DoorStatus) => {
        this.gotDoorStatus.emit(status);
        this.gotError.emit(); // This actually clears the error
      },
      error => {
        this.gotError.emit({ error, type: 'Door Status' });
        this.errorHandler.sendError('DoorStatus', this.sAMAccountName, error);
      });

    // If this is the first time, setup a subscription to automatically refresh
    if (!this.refreshSubscription) {
      this.refreshSubscription = onErrorResumeNext(
        timer(environment.doorStatusRefreshMs, environment.doorStatusRefreshMs)
      ).subscribe(() => this.getStatus());
    }
  }
}