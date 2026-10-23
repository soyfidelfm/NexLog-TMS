import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LOADING_MIN_VISIBLE_MS, LOADING_SHOW_DELAY_MS, LoadingService } from './loading.service';

describe('LoadingService', () => {
  let loading: LoadingService;

  beforeEach(() => {
    vi.useFakeTimers();
    loading = TestBed.inject(LoadingService);
  });
  afterEach(() => vi.useRealTimers());

  it('counts in-flight requests up and down', () => {
    const a = loading.begin();
    const b = loading.begin();
    expect(loading.pending()).toBe(2);
    expect(loading.busy()).toBe(true);
    a();
    expect(loading.pending()).toBe(1);
    b();
    expect(loading.pending()).toBe(0);
    expect(loading.busy()).toBe(false);
  });

  it('release is idempotent (never goes negative or double-decrements)', () => {
    const a = loading.begin();
    const b = loading.begin();
    a();
    a();
    expect(loading.pending()).toBe(1);
    b();
    expect(loading.pending()).toBe(0);
  });

  it('does not show for fast requests (flicker guard)', () => {
    const done = loading.begin();
    vi.advanceTimersByTime(LOADING_SHOW_DELAY_MS - 10);
    done();
    vi.advanceTimersByTime(1000);
    expect(loading.visible()).toBe(false);
  });

  it('shows once a request lasts longer than the show delay', () => {
    loading.begin();
    vi.advanceTimersByTime(LOADING_SHOW_DELAY_MS - 1);
    expect(loading.visible()).toBe(false);
    vi.advanceTimersByTime(1);
    expect(loading.visible()).toBe(true);
  });

  it('stays visible for the minimum time after the request ends', () => {
    const done = loading.begin();
    vi.advanceTimersByTime(LOADING_SHOW_DELAY_MS);
    expect(loading.visible()).toBe(true);
    vi.advanceTimersByTime(100); // shown for 100ms, request ends
    done();
    expect(loading.visible()).toBe(true);
    vi.advanceTimersByTime(LOADING_MIN_VISIBLE_MS - 100 - 1);
    expect(loading.visible()).toBe(true);
    vi.advanceTimersByTime(1);
    expect(loading.visible()).toBe(false);
  });

  it('hides immediately when it has already been visible longer than the minimum', () => {
    const done = loading.begin();
    vi.advanceTimersByTime(LOADING_SHOW_DELAY_MS + LOADING_MIN_VISIBLE_MS + 50);
    done();
    expect(loading.visible()).toBe(false);
  });

  it('a new request during the minimum-time wait keeps one continuous overlay', () => {
    const first = loading.begin();
    vi.advanceTimersByTime(LOADING_SHOW_DELAY_MS);
    first();
    const second = loading.begin(); // chained request
    vi.advanceTimersByTime(LOADING_MIN_VISIBLE_MS * 3);
    expect(loading.visible()).toBe(true);
    second();
    vi.advanceTimersByTime(LOADING_MIN_VISIBLE_MS * 3);
    expect(loading.visible()).toBe(false);
  });

  it('overlapping requests share a single overlay until the last one ends', () => {
    const a = loading.begin();
    const b = loading.begin();
    vi.advanceTimersByTime(LOADING_SHOW_DELAY_MS + LOADING_MIN_VISIBLE_MS);
    a();
    expect(loading.visible()).toBe(true);
    b();
    expect(loading.visible()).toBe(false);
  });
});
