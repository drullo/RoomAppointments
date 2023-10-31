import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { config } from '@environment/config';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  constructor(private http: HttpClient) { }

  getPhotoContent(filename: string): Observable<any> {
    const body = {
      site: `${config.sharePoint.serverUrl}/${config.sharePoint.employeePhotoSite}`,
      folder: `${config.sharePoint.employeePhotoSite}/${config.sharePoint.employeePhotoList}`,
      filename: filename.split('/').slice(-1)[0]
    };


    const request = new HttpRequest(
      'POST',
      `${config.utilityApiUrl}/sharepoint/filecontent/stream`,
      body,
      { responseType: 'blob' });

    return this.http.request(request);
  }
}