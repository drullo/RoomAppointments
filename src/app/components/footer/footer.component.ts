
//#region Imports
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import {interval, Subscription } from 'rxjs';
import { DateTime } from 'luxon';
import { config } from '@environment/config';
//#endregion

@Component({
    selector: 'cp-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css'],
    standalone: false
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
    this.tickerSubscription = interval(1000).subscribe(() => this.currentTime = DateTime.now().toJSDate());
  }

  ngOnDestroy(): void {
    if (this.tickerSubscription) {
      this.tickerSubscription.unsubscribe();
    }
  }
  //#endregion
}
