import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ThemeService, Theme } from '../../core/services/theme.service';
import { AuthFacade } from '../../store/auth/auth.facade';
import { UserApiService } from '../../core/api/user-api.service';
import { ToastService } from '../../shared/services/toast.service';
import { DEFAULT_PREFERENCES, UserPreferences, UpdatePreferencesRequest } from '../../core/models/user.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  private themeService = inject(ThemeService);
  private authFacade = inject(AuthFacade);
  private userApi = inject(UserApiService);
  private toastService = inject(ToastService);

  readonly currentTheme = this.themeService.theme;
  readonly isSaving = signal(false);

  readonly preferences = signal<UserPreferences>({ ...DEFAULT_PREFERENCES });

  readonly isDark = computed(() => this.currentTheme() === 'dark');

  ngOnInit(): void {
    const user = this.authFacade.currentUser();
    if (user?.preferences) {
      const prefs = this.parsePreferences(user.preferences);
      this.preferences.set(prefs);
    }
  }

  onThemeToggle(): void {
    this.themeService.toggleTheme();
  }

  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  onPreferenceChange(key: keyof UserPreferences, value: boolean): void {
    this.preferences.update(p => ({ ...p, [key]: value }));
    this.savePreference({ [key]: value });
  }

  onBrowserNotificationsToggle(enabled: boolean): void {
    if (enabled && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        const granted = permission === 'granted';
        this.preferences.update(p => ({ ...p, browserNotifications: granted }));
        this.savePreference({ browserNotifications: granted });
        if (!granted) {
          this.toastService.show('Browser notifications were blocked. Please enable them in your browser settings.', 'info');
        }
      });
    } else {
      this.preferences.update(p => ({ ...p, browserNotifications: false }));
      this.savePreference({ browserNotifications: false });
    }
  }

  private savePreference(update: UpdatePreferencesRequest): void {
    this.isSaving.set(true);
    this.userApi.updatePreferences(update).subscribe({
      next: (updatedUser) => {
        this.authFacade.updateUser(updatedUser);
        this.isSaving.set(false);
      },
      error: (err) => {
        this.toastService.show(err.error?.message || 'Failed to save preference', 'error');
        this.isSaving.set(false);
      },
    });
  }

  private parsePreferences(prefs: unknown): UserPreferences {
    if (typeof prefs === 'string') {
      try {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(prefs) };
      } catch {
        return { ...DEFAULT_PREFERENCES };
      }
    }
    return { ...DEFAULT_PREFERENCES, ...(prefs as Partial<UserPreferences>) };
  }
}
