import { Component, input, output } from '@angular/core';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [],
  templateUrl: './profile-info.html',
  styleUrl: './profile-info.scss'
})
export class ProfileInfo {
  user = input.required<User>();
  memberSince = input.required<string>();

  editClicked = output<void>();
  logoutClicked = output<void>();

  onEdit() {
    this.editClicked.emit();
  }

  onLogout() {
    this.logoutClicked.emit();
  }
}
