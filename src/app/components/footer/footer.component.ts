
//#region Imports
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {interval, Subscription } from 'rxjs';
import * as moment from 'moment';
import { config } from '@environment/config';
//#endregion

@Component({
  selector: 'cp-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {
  //#region Fields
  @Input() lastCheckTime: Date;
  currentTime: Date;
  version = config.version;
  private tickerSubscription: Subscription;
  //#endregion

  //#region Lifecycle
  ngOnInit(): void {
    this.tickerSubscription = interval(1000).subscribe(() => this.currentTime = moment().toDate());
  }

  ngOnDestroy(): void {
    if (this.tickerSubscription) {
      this.tickerSubscription.unsubscribe();
    }
  }
  //#endregion
}
