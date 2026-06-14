import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-profile-banner',
  standalone: true,
  imports: [],
  templateUrl: './profile-banner.html',
  styleUrl: './profile-banner.scss',
})
export class ProfileBanner {
  coverImageUrl = input<string | null>(null);
  profileImageUrl = input<string | null>(null);
  userInitials = input<string>('');
  isUploadingCover = input<boolean>(false);
  isUploadingProfile = input<boolean>(false);

  coverImageSelected = output<Event>();
  profileImageSelected = output<Event>();

  onCoverImageSelected(event: Event) {
    this.coverImageSelected.emit(event);
  }

  onProfileImageSelected(event: Event) {
    this.profileImageSelected.emit(event);
  }
}
