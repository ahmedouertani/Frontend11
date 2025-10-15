import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

/**
 * Platform Detection Service
 * Use this service to safely detect if code is running in browser or server
 * and avoid SSR errors when accessing browser-only APIs
 */
@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /**
   * Check if code is running in browser
   */
  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Check if code is running on server (SSR)
   */
  isServer(): boolean {
    return isPlatformServer(this.platformId);
  }

  /**
   * Safely access window object
   * Returns undefined on server
   */
  getWindow(): Window | undefined {
    return this.isBrowser() ? window : undefined;
  }

  /**
   * Safely access document object
   * Returns undefined on server
   */
  getDocument(): Document | undefined {
    return this.isBrowser() ? document : undefined;
  }

  /**
   * Safely access localStorage
   * Returns undefined on server
   */
  getLocalStorage(): Storage | undefined {
    return this.isBrowser() ? localStorage : undefined;
  }

  /**
   * Safely access sessionStorage
   * Returns undefined on server
   */
  getSessionStorage(): Storage | undefined {
    return this.isBrowser() ? sessionStorage : undefined;
  }

  /**
   * Get window location (URL)
   * Returns undefined on server
   */
  getLocation(): Location | undefined {
    return this.isBrowser() ? window.location : undefined;
  }

  /**
   * Execute callback only in browser
   * @param callback Function to execute
   * @param fallback Optional fallback for server
   */
  runInBrowser<T>(callback: () => T, fallback?: () => T): T | undefined {
    if (this.isBrowser()) {
      return callback();
    }
    return fallback ? fallback() : undefined;
  }

  /**
   * Execute callback only on server
   * @param callback Function to execute
   */
  runOnServer<T>(callback: () => T): T | undefined {
    if (this.isServer()) {
      return callback();
    }
    return undefined;
  }
}
