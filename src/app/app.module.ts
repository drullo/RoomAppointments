//#region Imports
// Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { ActiveDirectoryModule } from '@cleavelandprice/ngx-lib/active-directory';
import { SharePointModule } from '@cleavelandprice/ngx-lib/sharepoint';

// Pipes
import { AppointmentNowPipe } from '@pipes/appointment-now.pipe';
import { DoorClosedPipe } from '@pipes/door-closed.pipe';
import { EmployeeByEmailPipe } from '@pipes/employee-by-email.pipe';
import { ErrorDetailsPipe } from '@pipes/error-details.pipe';
import { RoomIsPersonPipe } from '@pipes/room-is-person.pipe';
import { StripMiddleNamePipe } from '@pipes/strip-middle-name.pipe';

// Components
import { AppComponent } from '@components/app/app.component';
import { AppointmentsComponent } from '@components/appointments/appointments.component';
import { DoorStatusComponent } from '@components/door-status/door-status.component';
import { FooterComponent } from '@components/footer/footer.component';
import { InOutStatusComponent } from '@components/in-out-status/in-out-status.component';
import { RoomSelectorComponent } from '@components/room-selector/room-selector.component';
import { LimitSubjectLengthPipe } from './pipes/limit-subject-length.pipe';
//#endregion

@NgModule({
    declarations: [
        // Pipes
        AppointmentNowPipe,
        DoorClosedPipe,
        EmployeeByEmailPipe,
        ErrorDetailsPipe,
        RoomIsPersonPipe,
        StripMiddleNamePipe,
        // Components
        AppComponent,
        AppointmentsComponent,
        DoorStatusComponent,
        FooterComponent,
        InOutStatusComponent,
        RoomSelectorComponent,
        LimitSubjectLengthPipe
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDialogModule,
        MatInputModule,
        MatMomentDateModule,
        MatProgressSpinnerModule,
        MatSelectModule,

        ActiveDirectoryModule,
        SharePointModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
