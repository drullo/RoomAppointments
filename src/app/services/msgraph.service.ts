import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, inject, Injectable, Output } from '@angular/core';
import { config } from '@environment/config';
import { StorageService } from './storage.service';
import { timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MsgraphService {
  @Output() gotSecret = new EventEmitter();
  
  #services = {
    http: inject(HttpClient),
    storage: inject(StorageService)
  };

  constructor() {
    // Refreshing the secret every few hours because it expires periodically and gets updated in the database
    timer(0, config.msGraph.secretRefreshHours * 60 * 60 * 1000)
      .subscribe(() => this.#getSecret());
  }
  
  #getSecret() {
    // Get the MS Graph secret for all subsequent calls
    this.#services.http.get(`${config.utilityApiUrl}/users/pw/${config.msGraph.utilityApiUser}`, { responseType: 'text' })
      .subscribe({
        next: (secret) => {
          this.#services.storage.msGraphHeader = new HttpHeaders().set('secret', secret);
          this.gotSecret.emit();
        },
        error: err => console.log('Failed to get MS Graph secret from API', err)
      });
  }
}