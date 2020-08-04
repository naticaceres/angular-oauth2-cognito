import { Injectable } from '@angular/core';

const APP_PREFIX = 'AUTH_EXAMPLE';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() {}

  setItem(key: string, value: any) {
    localStorage.setItem(APP_PREFIX + key, JSON.stringify(value));
  }

  getItem(key: string) {
    return JSON.parse(localStorage.getItem(APP_PREFIX + key));
  }

  removeItem(key: string) {
    localStorage.removeItem(APP_PREFIX + key);
  }
}
