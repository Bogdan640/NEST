import { Injectable, signal, effect, inject } from '@angular/core';
import { UserApiService } from '../api/user-api.service';
import { THEME_STORAGE_KEY } from '../constants/ui';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private userApi = inject(UserApiService);

  readonly theme = signal<Theme>(this.getStoredTheme());

  constructor() {
    // Reactively apply theme to DOM whenever the signal changes
    effect(() => {
      const t = this.theme();
      document.documentElement.setAttribute('data-theme', t);
      localStorage.setItem(THEME_STORAGE_KEY, t);
    });
  }

  /**
   * Initialize from a user's stored preferences (called after login / session restore).
   */
  initializeFromPreferences(theme: Theme): void {
    this.theme.set(theme);
  }

  toggleTheme(): void {
    const next: Theme = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(next);
    this.persistToBackend(next);
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
    this.persistToBackend(theme);
  }

  private persistToBackend(theme: Theme): void {
    this.userApi.updatePreferences({ theme }).subscribe({
      error: (err) => console.error('Failed to save theme preference:', err),
    });
  }

  private getStoredTheme(): Theme {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    // Respect OS preference as fallback
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }
}
