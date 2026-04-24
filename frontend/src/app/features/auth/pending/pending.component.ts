import { Component, inject } from '@angular/core';
import { AuthFacade } from '../../../store/auth/auth.facade';

@Component({
  selector: 'app-pending',
  standalone: true,
  imports: [],
  templateUrl: './pending.component.html',
  styleUrl: './pending.component.scss',
})
export class PendingComponent {
  private authFacade = inject(AuthFacade);

  onLogout(): void {
    this.authFacade.logout();
  }
}
