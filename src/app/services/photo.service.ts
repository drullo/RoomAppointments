import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { config } from '@environment/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private http = inject(HttpClient);

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