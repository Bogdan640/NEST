import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthFacade } from '../../store/auth/auth.facade';
import { ShedFacade } from '../../store/shed/shed.facade';
import { DatePipe } from '@angular/common';
import { ToastService } from '../../shared/services/toast.service';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private authFacade = inject(AuthFacade);
  private shedFacade = inject(ShedFacade);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  
  currentUser = this.authFacade.currentUser;
  isEditing = signal(false);
  isSaving = signal(false);
  isUploadingProfile = signal(false);
  isUploadingCover = signal(false);

  profileForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    phoneNumber: [''],
    headline: ['', [Validators.maxLength(120)]],
    about: ['', [Validators.maxLength(1000)]],
  });

  get borrowedTools() {
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
  }

  get memberSince(): string {
    const user = this.currentUser();
    if (!user) return '';
    return new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  }

  get exactMemberSince(): string {
    const user = this.currentUser();
    if (!user) return '';
    return new Date(user.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  get profileImageUrl(): string | null {
    const user = this.currentUser();
    if (!user?.profileImage) return null;
    // If already a full URL, return as-is; otherwise prepend API base
    if (user.profileImage.startsWith('http')) return user.profileImage;
    return `http://localhost:3000${user.profileImage}`;
  }

  get coverImageUrl(): string | null {
    const user = this.currentUser();
    if (!user?.coverImage) return null;
    if (user.coverImage.startsWith('http')) return user.coverImage;
    return `http://localhost:3000${user.coverImage}`;
  }

  get userInitials(): string {
    const user = this.currentUser();
    if (!user) return '';
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`;
  }

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

    this.http.put(API_ENDPOINTS.USER.ME, formValue).subscribe({
      next: (updatedUser: any) => {
        this.toastService.show('Profile updated successfully! 🎉', 'success');
        this.isEditing.set(false);
        this.isSaving.set(false);
        localStorage.setItem('nest_auth_user', JSON.stringify(updatedUser));
        this.authFacade.tryRestoreSession();
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

    this.http.post(API_ENDPOINTS.USER.UPLOAD_PROFILE_IMAGE, formData).subscribe({
      next: (updatedUser: any) => {
        this.toastService.show('Profile picture updated! 📸', 'success');
        this.isUploadingProfile.set(false);
        localStorage.setItem('nest_auth_user', JSON.stringify(updatedUser));
        this.authFacade.tryRestoreSession();
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

    this.http.post(API_ENDPOINTS.USER.UPLOAD_COVER_IMAGE, formData).subscribe({
      next: (updatedUser: any) => {
        this.toastService.show('Cover image updated! 🖼️', 'success');
        this.isUploadingCover.set(false);
        localStorage.setItem('nest_auth_user', JSON.stringify(updatedUser));
        this.authFacade.tryRestoreSession();
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
