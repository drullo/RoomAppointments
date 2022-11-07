import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { config } from '@environment/config';

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  constructor(private http: HttpClient) { }

  /*
    This gets the version from UtilityAPI.
    If the service reports a different version than what you have locally, then subsequent code should force a page refresh.
    You probably won't call this method directly, but I've made it public in case you want to.  checkVersion() calls this method.
    Note, the app name is pulled from package.json (via config.ts).
  */
  get(): Observable<{app: string, version: string}> {
    return this.http.get<{app: string, version: string}>(`${config.utilityApiUrl}/appversions/${config.appName}`);
  }

  /*
    This is the method that does the version comparison and page refresh.
    All you have to do is import this service and call this method at the start of your app.
  */
  checkVersion(): void {
    this.get()
      .subscribe(app => {
        // Is there a version mismatch?  If not, then the method just exits.
        if (app.version !== config.version) {
          const today = JSON.stringify(moment().startOf('day'));
          const lastRefresh = localStorage.getItem('lastVersionRefresh');

          // Check to make sure we haven't already tried to refresh today
          if (!lastRefresh || lastRefresh !== today) {
            localStorage.setItem('lastVersionRefresh', today); // Store the date that we last forced a refresh
            location.reload(); // Force a page fresh
          } else if (lastRefresh) {
            // Already tried today, so just let the user run the current version, but tell them about it.
            // tslint:disable-next-line:max-line-length
            alert(`Your browser is running a cached version (${config.version}) of this app.  The latest version is ${app.version}.  Automatic refresh was not attempted because it has already been tried today.`);
          }
        }
      }, err => {
        // If we get a 404, it probably means that this app doesn't exist in the database so UtilityAPI can't find the record.
        if (err.status !== 404) { return; } // Something else went wrong

        // Construct a powershell command and spit it out to the console to tell IT how to fix this problem.
        const powershell =
          // tslint:disable-next-line:max-line-length
          `Invoke-RestMethod ${config.utilityApiUrl}/appversions -Method Post -ContentType 'application/json' -Body (@{app='${config.appName}';version='${config.version}'} | ConvertTo-Json)`;
        console.log(`App version not found in UtilityAPI.  Please run the following PowerShell command:\n${powershell}`);
      });
  }
}
