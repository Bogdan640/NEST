import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthFacade } from './store/auth/auth.facade';
import { ThemeService } from './core/services/theme.service';
import { ToastComponent } from './shared/components/toast/toast.component';
import { DEFAULT_PREFERENCES, UserPreferences } from './core/models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private authFacade = inject(AuthFacade);
  private themeService = inject(ThemeService);

  ngOnInit(): void {
    this.authFacade.tryRestoreSession();

    // Initialize theme from user preferences if available
    const user = this.authFacade.currentUser();
    if (user?.preferences) {
      const prefs = this.parsePreferences(user.preferences);
      this.themeService.initializeFromPreferences(prefs.theme);
    }
  }

  private parsePreferences(prefs: unknown): UserPreferences {
    if (typeof prefs === 'string') {
      try {
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(prefs) };
      } catch {
        return DEFAULT_PREFERENCES;
      }
    }
    return { ...DEFAULT_PREFERENCES, ...(prefs as Partial<UserPreferences>) };
  }
}
