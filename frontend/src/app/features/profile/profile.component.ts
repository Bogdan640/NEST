import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthFacade } from '../../store/auth/auth.facade';
import { ShedFacade } from '../../store/shed/shed.facade';
import { DatePipe } from '@angular/common';
import { ToastService } from '../../shared/services/toast.service';
import { HttpClient } from '@angular/common/http';
import { API_ENDPOINTS } from '../../core/constants/api-endpoints';

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
        // Refresh user in localStorage and store
        const token = localStorage.getItem('nest_token') || '';
        localStorage.setItem('nest_user', JSON.stringify(updatedUser));
        this.authFacade.tryRestoreSession();
      },
      error: (err) => {
        this.toastService.show(err.error?.message || 'Failed to update profile', 'error');
        this.isSaving.set(false);
      }
    });
  }

  logout(): void {
    this.authFacade.logout();
  }
}
