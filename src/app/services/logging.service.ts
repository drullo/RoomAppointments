import { Injectable } from '@angular/core';
import { config } from '@environment/config';
import { environment } from '@environment/environment';
import * as structuredLog from '@eyegym/structured-log';
import * as seqSink from '@eyegym/structured-log-seq-sink';


@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  log = structuredLog.configure()
    // Have to add enrichers before .writeTo() - otherwise they have no effect (doc doesn't mention this)
    .enrich({
      'Source': config.logging.source,
      'UserAgent': navigator.userAgent,
      'Authors:': config.logging.authors,
      'AppType': config.logging.appType
    })
    .writeTo(new structuredLog.ConsoleSink({ includeProperties: true, includeTimestamps: true }))
    .writeTo(seqSink({
      url: environment.logging.seqUrl
    }))
    .minLevel(environment.logging.minLevel)
    .create();
}