import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { ExchangeService } from './services/exchange.service';
import { RoomSelectorComponent } from './components/room-selector/room-selector.component';

import {
  MdSelectModule,
  MdInputModule,
  MdDatepickerModule,
  MdNativeDateModule,
  MdCheckboxModule,
  MdButtonModule
} from '@angular/material';

// PrimeNg
import {
  CalendarModule,
  CheckboxModule,
  DropdownModule,
  PasswordModule
} from 'primeng/primeng';

@NgModule({
  declarations: [
    AppComponent,
    RoomSelectorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,

    CalendarModule,
    CheckboxModule,
    DropdownModule,
    PasswordModule,

    MdSelectModule,
    MdInputModule,
    MdDatepickerModule,
    MdNativeDateModule,
    MdCheckboxModule,
    MdButtonModule
  ],
  providers: [
    ExchangeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
