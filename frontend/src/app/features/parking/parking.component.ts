import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ParkingFacade } from '../../store/parking/parking.facade';
import { AuthFacade } from '../../store/auth/auth.facade';
import { ParkingCardComponent } from './parking-card/parking-card.component';

@Component({
  selector: 'app-parking',
  standalone: true,
  imports: [ReactiveFormsModule, ParkingCardComponent],
  templateUrl: './parking.component.html',
  styleUrl: './parking.component.scss',
})
export class ParkingComponent {
  private fb = inject(FormBuilder);
  private parkingFacade = inject(ParkingFacade);
  private authFacade = inject(AuthFacade);

  announcements = this.parkingFacade.announcements;
  slots = this.parkingFacade.slots;
  isLoading = this.parkingFacade.isLoading;
  error = this.parkingFacade.error;
  
  currentUser = this.authFacade.currentUser;

  showCreateForm = signal(false);
  isSubmitting = signal(false);

  newAnnouncementForm = this.fb.nonNullable.group({
    parkingSlotId: ['', [Validators.required]],
    availableFrom: ['', [Validators.required]],
    availableTo: ['', [Validators.required]],
  });

  get mySlots() {
    const user = this.currentUser();
    if (!user) return [];
    return this.slots().filter(s => s.ownerId === user.id);
  }

  toggleForm(): void {
    this.showCreateForm.update(v => !v);
  }

  onSubmit(): void {
    if (this.newAnnouncementForm.invalid) return;
    
    this.isSubmitting.set(true);
    const formValue = this.newAnnouncementForm.getRawValue();
    
    this.parkingFacade.createAnnouncement(formValue);
    
    this.newAnnouncementForm.reset();
    this.showCreateForm.set(false);
    this.isSubmitting.set(false);
  }

  onDeleteAnnouncement(id: string): void {
    this.parkingFacade.deleteAnnouncement(id);
  }

  onApply(id: string): void {
    this.parkingFacade.applyToAnnouncement(id);
  }

  onApprove(applicationId: string): void {
    this.parkingFacade.approveApplication(applicationId);
  }

  canDelete(publisherId: string): boolean {
    const user = this.currentUser();
    return !!user && (user.id === publisherId || user.role === 'ADMIN');
  }
}
