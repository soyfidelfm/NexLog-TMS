import { TestBed } from '@angular/core/testing';
import { Subject, delay, of } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ChatUser } from '../../../core/models/chat.model';
import { chatTestProviders } from './chat-testing';
import { MockChatApi } from './mock-chat-api';
import { USER_SEARCH_DEBOUNCE_MS, UserSearchState, UserService } from './user.service';

describe('UserService.typeahead', () => {
  let users: UserService;
  let mock: MockChatApi;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({ providers: chatTestProviders() });
    mock = TestBed.inject(MockChatApi);
    mock.latencyMs = 0;
    mock.demoTraffic = false;
    users = TestBed.inject(UserService);
  });
  afterEach(() => vi.useRealTimers());

  it('debounces, skips short terms and excludes the current user', () => {
    const terms = new Subject<string>();
    const states: UserSearchState[] = [];
    users.typeahead(terms, () => 'demo-dana').subscribe(s => states.push(s));
    terms.next('d');
    terms.next('da');
    vi.advanceTimersByTime(USER_SEARCH_DEBOUNCE_MS - 1);
    expect(states.length).toBe(0);
    vi.advanceTimersByTime(1);
    const last = states.at(-1)!;
    expect(last.term).toBe('da');
    expect(last.loading).toBe(false);
    expect(last.users.some(u => u.id === 'demo-dana')).toBe(false);
    terms.next('x');
    vi.advanceTimersByTime(USER_SEARCH_DEBOUNCE_MS);
    expect(states.at(-1)).toEqual({ term: 'x', loading: false, error: false, users: [] });
  });

  it('cancels stale requests (only the latest term wins)', () => {
    const slow = (name: string, ms: number) => of([{ id: name, name, email: `${name}@example.com` } as ChatUser]).pipe(delay(ms));
    vi.spyOn(mock, 'searchUsers').mockImplementation((q: string) => (q === 'first' ? slow('first', 1000) : slow('second', 10)));
    const terms = new Subject<string>();
    const states: UserSearchState[] = [];
    users.typeahead(terms).subscribe(s => states.push(s));
    terms.next('first');
    vi.advanceTimersByTime(USER_SEARCH_DEBOUNCE_MS);
    expect(states.at(-1)!.loading).toBe(true);
    terms.next('second');
    vi.advanceTimersByTime(USER_SEARCH_DEBOUNCE_MS + 2000);
    expect(states.at(-1)!.users.map(u => u.id)).toEqual(['second']);
    expect(states.some(s => s.users.some(u => u.id === 'first'))).toBe(false);
  });
});
