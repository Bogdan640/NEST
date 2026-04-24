import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthFacade } from '../store/auth/auth.facade';
import { NAV_ITEMS } from '../core/constants/ui';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  private authFacade = inject(AuthFacade);

  navItems = NAV_ITEMS;
  currentUser = this.authFacade.currentUser;
  userFullName = this.authFacade.userFullName;
  isAdmin = this.authFacade.isAdmin;

  onLogout(): void {
    this.authFacade.logout();
  }
}
