import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthFacade } from '../../store/auth/auth.facade';
import { ShedFacade } from '../../store/shed/shed.facade';

import { ToastService } from '../../shared/services/toast.service';
import { UserApiService } from '../../core/api/user-api.service';
import { environment } from '../../../environments/environment';
import { ProfileBanner } from './components/profile-banner/profile-banner';
import { ProfileInfo } from './components/profile-info/profile-info';
import { ProfileEditForm } from './components/profile-edit-form/profile-edit-form';
import { ProfileBorrowedTools } from './components/profile-borrowed-tools/profile-borrowed-tools';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, ProfileBanner, ProfileInfo, ProfileEditForm, ProfileBorrowedTools],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private authFacade = inject(AuthFacade);
  private shedFacade = inject(ShedFacade);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);
  private userApi = inject(UserApiService);

  readonly currentUser = this.authFacade.currentUser;
  readonly isEditing = signal(false);
  readonly isSaving = signal(false);
  readonly isUploadingProfile = signal(false);
  readonly isUploadingCover = signal(false);

  profileForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    phoneNumber: [''],
    headline: ['', [Validators.maxLength(120)]],
    about: ['', [Validators.maxLength(1000)]],
  });

  readonly borrowedTools = computed(() => {
    const user = this.currentUser();
    const resources = this.shedFacade.resources();
    if (!user || !resources) return [];

    return resources.filter(r =>
      r.reservations?.some(res =>
        res.borrowerId === user.id && res.status === 'APPROVED'
      )
    ).map(r => {
      const activeRes = r.reservations.find(res => res.borrowerId === user.id && res.status === 'APPROVED');
      return { resource: r, reservation: activeRes };
    });
  });

  readonly memberSince = computed(() => {
    const user = this.currentUser();
    if (!user) return '';
    return new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  });

  readonly exactMemberSince = computed(() => {
    const user = this.currentUser();
    if (!user) return '';
    return new Date(user.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  });

  readonly profileImageUrl = computed(() => {
    const user = this.currentUser();
    if (!user?.profileImage) return null;
    if (user.profileImage.startsWith('http')) return user.profileImage;
    return `${environment.apiBaseUrl}${user.profileImage}`;
  });

  readonly coverImageUrl = computed(() => {
    const user = this.currentUser();
    if (!user?.coverImage) return null;
    if (user.coverImage.startsWith('http')) return user.coverImage;
    return `${environment.apiBaseUrl}${user.coverImage}`;
  });

  readonly userInitials = computed(() => {
    const user = this.currentUser();
    if (!user) return '';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`;
  });

  ngOnInit() {
    this.shedFacade.loadResources({ page: 1, limit: 50 });
  }

  startEditing(): void {
    const user = this.currentUser();
    if (!user) return;
    this.profileForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber || '',
      headline: user.headline || '',
      about: user.about || '',
    });
    this.isEditing.set(true);
  }

  cancelEditing(): void {
    this.isEditing.set(false);
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;

    this.isSaving.set(true);
    const formValue = this.profileForm.getRawValue();

    this.userApi.updateMe(formValue as any).subscribe({
      next: (updatedUser) => {
        this.toastService.show('Profile updated successfully! 🎉', 'success');
        this.isEditing.set(false);
        this.isSaving.set(false);
        this.authFacade.updateUser(updatedUser);
      },
      error: (err) => {
        this.toastService.show(err.error?.message || 'Failed to update profile', 'error');
        this.isSaving.set(false);
      }
    });
  }

  onProfileImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (file.size > 5 * 1024 * 1024) {
      this.toastService.show('Image must be under 5MB', 'error');
      return;
    }

    this.isUploadingProfile.set(true);
    const formData = new FormData();
    formData.append('profileImage', file);

    this.userApi.uploadProfileImage(formData).subscribe({
      next: (updatedUser) => {
        this.toastService.show('Profile picture updated! 📸', 'success');
        this.isUploadingProfile.set(false);
        this.authFacade.updateUser(updatedUser);
      },
      error: (err) => {
        this.toastService.show(err.error?.message || 'Failed to upload image', 'error');
        this.isUploadingProfile.set(false);
      }
    });
  }

  onCoverImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (file.size > 5 * 1024 * 1024) {
      this.toastService.show('Image must be under 5MB', 'error');
      return;
    }

    this.isUploadingCover.set(true);
    const formData = new FormData();
    formData.append('coverImage', file);

    this.userApi.uploadCoverImage(formData).subscribe({
      next: (updatedUser) => {
        this.toastService.show('Cover image updated! 🖼️', 'success');
        this.isUploadingCover.set(false);
        this.authFacade.updateUser(updatedUser);
      },
      error: (err) => {
        this.toastService.show(err.error?.message || 'Failed to upload cover image', 'error');
        this.isUploadingCover.set(false);
      }
    });
  }

  logout(): void {
    this.authFacade.logout();
  }
}
