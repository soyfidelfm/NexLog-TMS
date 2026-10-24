import { Injectable, inject } from '@angular/core';
import { Observable, catchError, debounceTime, distinctUntilChanged, map, of, startWith, switchMap } from 'rxjs';
import { ChatUser } from '../../../core/models/chat.model';
import { ChatBackend } from './chat-backend.service';

export interface UserSearchState {
  term: string;
  loading: boolean;
  error: boolean;
  users: ChatUser[];
}

export const USER_SEARCH_MIN_CHARS = 2;
export const USER_SEARCH_DEBOUNCE_MS = 300;

/** System user search (GET /api/users/search) for starting conversations. */
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly backend = inject(ChatBackend);

  search(q: string, limit = 8): Observable<ChatUser[]> {
    return this.backend.call(api => api.searchUsers(q, limit));
  }

  /**
   * Debounced typeahead: ignores terms shorter than USER_SEARCH_MIN_CHARS, and `switchMap` cancels the
   * in-flight request when the term changes (stale responses are never shown). `excludeId` hides the current user.
   */
  typeahead(terms$: Observable<string>, excludeId?: () => string | null): Observable<UserSearchState> {
    return terms$.pipe(
      map(t => t.trim()),
      debounceTime(USER_SEARCH_DEBOUNCE_MS),
      distinctUntilChanged(),
      switchMap(term => {
        if (term.length < USER_SEARCH_MIN_CHARS) return of<UserSearchState>({ term, loading: false, error: false, users: [] });
        return this.search(term).pipe(
          map(users => {
            const me = excludeId?.();
            return { term, loading: false, error: false, users: me ? users.filter(u => u.id !== me) : users };
          }),
          catchError(() => of<UserSearchState>({ term, loading: false, error: true, users: [] })),
          startWith<UserSearchState>({ term, loading: true, error: false, users: [] }),
        );
      }),
    );
  }
}
