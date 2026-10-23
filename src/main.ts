/// <reference types="zone.js" />
import 'zone.js';

import { bootstrapApplication } from '@angular/platform-browser';
import { setWorkerUrl } from 'maplibre-gl';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// MapLibre v6 needs an explicit worker URL. Force it before any map is created.
if (typeof window !== 'undefined') {
  setWorkerUrl(new URL('/maplibre-gl-worker.mjs', window.location.origin).href);
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
