import { Component, inject } from '@angular/core';
import { AuthFacade } from '../../store/auth/auth.facade';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  private authFacade = inject(AuthFacade);
  currentUser = this.authFacade.currentUser;

  logout(): void {
    this.authFacade.logout();
  }
}
