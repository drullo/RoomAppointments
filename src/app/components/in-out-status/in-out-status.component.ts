import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { environment } from '@environment/environment';
import { InOutStatus } from '@model/in-out-status';
import { ErrorHandlerService } from '@services/error-handler.service';
import { InOutService } from '@services/in-out.service';
import { Subscription, onErrorResumeNext, timer } from 'rxjs';

@Component({
  selector: 'cp-in-out-status',
  templateUrl: './in-out-status.component.html',
  styleUrls: ['./in-out-status.component.css']
})
export class InOutStatusComponent implements OnInit, OnDestroy {
  private inOutService = inject(InOutService);
  private errorHandler = inject(ErrorHandlerService);
  
  //#region Fields
  @Input() sAMAccountName: string;
  @Output() gotInOutStatus = new EventEmitter<InOutStatus>();
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
    this.inOutService.getStatus(this.sAMAccountName)
      .subscribe({
        next: (status) => {
          this.gotInOutStatus.emit(status);
          this.gotError.emit(); // This actually clears the error
        },
        error: (err) => {
          this.gotError.emit({ err, type: 'InOut Status' });
          this.errorHandler.sendError('InOutStatus', this.sAMAccountName, err);
        }
      });

    // If this is the first time, setup a subscription to automatically refresh
    if (!this.refreshSubscription) {
      this.refreshSubscription = onErrorResumeNext(
        timer(environment.inOutStatusRefreshMs, environment.inOutStatusRefreshMs)
      ).subscribe(() => this.getStatus());
    }
  }
}