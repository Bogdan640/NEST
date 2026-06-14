import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthFacade } from './store/auth/auth.facade';
import { ThemeService } from './core/services/theme.service';
import { ToastComponent } from './shared/components/toast/toast.component';
import { DEFAULT_PREFERENCES, UserPreferences, parseUserPreferences } from './core/models/user.model';

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
      const prefs = parseUserPreferences(user.preferences);
      this.themeService.initializeFromPreferences(prefs.theme);
    }
  }
}
