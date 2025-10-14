import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { environment } from '@environment/environment';
import { DoorStatus } from '@model/door-status';
import { DoorStatusService } from '@services/door-status.service';
import { ErrorHandlerService } from '@services/error-handler.service';
import { Subscription, onErrorResumeNext, timer } from 'rxjs';

@Component({
    selector: 'cp-door-status',
    templateUrl: './door-status.component.html',
    styleUrls: ['./door-status.component.css'],
    standalone: false
})
export class DoorStatusComponent implements OnInit, OnDestroy {
  private doorService = inject(DoorStatusService);
  private errorHandler = inject(ErrorHandlerService);
  
  //#region Fields
  @Input() sAMAccountName: string;
  @Output() gotDoorStatus = new EventEmitter<DoorStatus>();
  @Output() gotError = new EventEmitter();
  private refreshSubscription: Subscription;
  //#endregion

  //#region Lifecycle
  ngOnInit(): void {
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
      .subscribe({
        next: (status) => {
          this.gotDoorStatus.emit(status);
          this.gotError.emit(); // This actually clears the error
        },
        error: (err) => {
          this.gotError.emit({ err, type: 'Door Status' });
          this.errorHandler.sendError('DoorStatus', this.sAMAccountName, err);
        }
      });

    // If this is the first time, setup a subscription to automatically refresh
    if (!this.refreshSubscription) {
      this.refreshSubscription = onErrorResumeNext(
        timer(environment.doorStatusRefreshMs, environment.doorStatusRefreshMs)
      ).subscribe(() => this.getStatus());
    }
  }
}