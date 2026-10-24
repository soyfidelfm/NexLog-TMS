import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TOAST_DEFAULT_MS, TOAST_MAX_VISIBLE, ToastService } from './toast.service';

describe('ToastService', () => {
  let toasts: ToastService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    toasts = TestBed.inject(ToastService);
  });
  afterEach(() => vi.useRealTimers());

  it('shows newest first and auto-dismisses after the default duration', () => {
    toasts.info('one');
    toasts.info('two');
    expect(toasts.toasts().map(t => t.title)).toEqual(['two', 'one']);
    vi.advanceTimersByTime(TOAST_DEFAULT_MS - 1);
    expect(toasts.toasts().length).toBe(2);
    vi.advanceTimersByTime(1);
    expect(toasts.toasts().length).toBe(0);
  });

  it('pauses the countdown while hovered and resumes with the remaining time', () => {
    const id = toasts.show({ title: 'hover me', durationMs: 1000 });
    vi.advanceTimersByTime(600);
    toasts.pause(id);
    expect(toasts.toasts()[0].paused).toBe(true);
    vi.advanceTimersByTime(5000);
    expect(toasts.toasts().length).toBe(1);
    toasts.resume(id);
    expect(toasts.toasts()[0].paused).toBe(false);
    vi.advanceTimersByTime(399);
    expect(toasts.toasts().length).toBe(1);
    vi.advanceTimersByTime(1);
    expect(toasts.toasts().length).toBe(0);
  });

  it('keeps sticky toasts (durationMs 0) until dismissed', () => {
    const id = toasts.show({ title: 'sticky', durationMs: 0 });
    vi.advanceTimersByTime(60_000);
    expect(toasts.toasts().length).toBe(1);
    toasts.dismiss(id);
    expect(toasts.toasts().length).toBe(0);
  });

  it('caps the stack, evicting the oldest', () => {
    for (let i = 0; i < TOAST_MAX_VISIBLE + 2; i++) toasts.info(`t${i}`);
    expect(toasts.toasts().length).toBe(TOAST_MAX_VISIBLE);
    expect(toasts.toasts()[0].title).toBe(`t${TOAST_MAX_VISIBLE + 1}`);
    expect(toasts.toasts().some(t => t.title === 't0')).toBe(false);
  });

  it('activate runs the click handler and closes the toast', () => {
    const onClick = vi.fn();
    const id = toasts.show({ title: 'click', onClick });
    toasts.activate(id);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(toasts.toasts().length).toBe(0);
  });
});
