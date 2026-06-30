import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ParkingFacade } from '../../store/parking/parking.facade';
import { AuthFacade } from '../../store/auth/auth.facade';
import { ParkingCardComponent } from './parking-card/parking-card.component';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-parking',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ParkingCardComponent,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './parking.component.html',
  styleUrl: './parking.component.scss',
})
export class ParkingComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private parkingFacade = inject(ParkingFacade);
  private authFacade = inject(AuthFacade);
  private toastService = inject(ToastService);

  announcements = this.parkingFacade.announcements;
  slots = this.parkingFacade.slots;
  isLoading = this.parkingFacade.isLoading;
  error = this.parkingFacade.error;
  
  currentUser = this.authFacade.currentUser;

  showCreateForm = signal(false);
  showSlotForm = signal(false);
  isSubmitting = signal(false);

  today = new Date();

  newAnnouncementForm = this.fb.nonNullable.group({
    parkingSlotId: ['', [Validators.required]],
    fromDate: [null as Date | null, [Validators.required]],
    fromTime: ['', [Validators.required]],
    toDate: [null as Date | null, [Validators.required]],
    toTime: ['', [Validators.required]],
  }, { validators: this.dateRangeValidator });

  newSlotForm = this.fb.nonNullable.group({
    identifier: ['', [Validators.required, Validators.maxLength(20)]],
  });

  dateFilter = (d: Date | null): boolean => {
    if (!d) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d >= today;
  };

  dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const fromDate = control.get('fromDate')?.value;
    const fromTime = control.get('fromTime')?.value;
    const toDate = control.get('toDate')?.value;
    const toTime = control.get('toTime')?.value;
    
    if (fromDate && fromTime && toDate && toTime) {
      const start = new Date(fromDate);
      const [sh, sm] = fromTime.split(':').map(Number);
      start.setHours(sh, sm, 0, 0);
      
      const end = new Date(toDate);
      const [eh, em] = toTime.split(':').map(Number);
      end.setHours(eh, em, 0, 0);

      if (start >= end) return { dateRangeInvalid: true };
      if (start <= new Date()) return { startInPast: true };
    }
    return null;
  }

  private pollingInterval: any;

  ngOnInit(): void {
    this.parkingFacade.loadSlots();
    // Poll the parking API every 20 seconds to keep announcements in sync
    this.pollingInterval = setInterval(() => {
      this.parkingFacade.loadAnnouncements({ page: 1, limit: 10 });
    }, 20000);
  }

  ngOnDestroy(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  get mySlots() {
    const user = this.currentUser();
    if (!user) return [];
    return this.slots().filter(s => s.ownerId === user.id);
  }

  toggleForm(): void {
    this.showCreateForm.update(v => !v);
  }

  toggleSlotForm(): void {
    this.showSlotForm.update(v => !v);
    if (this.showSlotForm()) {
      this.showCreateForm.set(false);
    }
  }

  onSubmit(): void {
    if (this.newAnnouncementForm.invalid) {
      this.toastService.show('Please fill all date fields correctly', 'error');
      return;
    }
    
    this.isSubmitting.set(true);
    const fv = this.newAnnouncementForm.getRawValue();
    
    const startDate = new Date(fv.fromDate!);
    const [sh, sm] = fv.fromTime.split(':').map(Number);
    startDate.setHours(sh, sm, 0, 0);

    const endDate = new Date(fv.toDate!);
    const [eh, em] = fv.toTime.split(':').map(Number);
    endDate.setHours(eh, em, 0, 0);
    
    this.parkingFacade.createAnnouncement({
      parkingSlotId: fv.parkingSlotId,
      availableFrom: startDate.toISOString(),
      availableTo: endDate.toISOString(),
    });
    
    this.newAnnouncementForm.reset();
    this.showCreateForm.set(false);
    this.isSubmitting.set(false);
  }

  onSubmitSlot(): void {
    if (this.newSlotForm.invalid) return;
    
    this.isSubmitting.set(true);
    const { identifier } = this.newSlotForm.getRawValue();
    
    this.parkingFacade.createSlot({ identifier });
    
    this.newSlotForm.reset();
    this.showSlotForm.set(false);
    this.isSubmitting.set(false);
    this.toastService.show('Parking spot registered! You can now share it.', 'success');
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
    return this.authFacade.canManageResource(publisherId);
  }
}
