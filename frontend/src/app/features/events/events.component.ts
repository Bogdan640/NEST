import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EventsFacade } from '../../store/events/events.facade';
import { AuthFacade } from '../../store/auth/auth.facade';
import { EventCardComponent } from './event-card/event-card.component';
import { EventType } from '../../core/models/event.model';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    EventCardComponent,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private eventsFacade = inject(EventsFacade);
  private authFacade = inject(AuthFacade);
  private toastService = inject(ToastService);

  events = this.eventsFacade.events;
  isLoading = this.eventsFacade.isLoading;
  error = this.eventsFacade.error;
  
  currentUser = this.authFacade.currentUser;

  showCreateForm = signal(false);
  isSubmitting = signal(false);

  eventTypes: EventType[] = ['SOCIAL', 'MEETING', 'MAINTENANCE', 'OTHER'];
  today = new Date();

  now = signal(new Date());
  private intervalId: any;
  private pollingInterval: any;

  ngOnInit() {
    // Update 'now' every minute to dynamically trigger expiration
    this.intervalId = setInterval(() => this.now.set(new Date()), 60000);
    
    // Poll the events API every 20 seconds to keep the list in sync
    this.pollingInterval = setInterval(() => {
      this.eventsFacade.loadEvents({ page: 1, limit: 20 });
    }, 20000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.pollingInterval) clearInterval(this.pollingInterval);
  }

  activeEvents = computed(() => {
    const currentNow = this.now();
    return this.events().filter(e => new Date(e.endTime) >= currentNow);
  });

  /** Min time for start: if start date is today, min time = now */
  get minStartTime(): string {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  }

  newEventForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    location: ['', [Validators.required]],
    startDate: [null as Date | null, [Validators.required]],
    startTimeStr: ['', [Validators.required]],
    endDate: [null as Date | null, [Validators.required]],
    endTimeStr: ['', [Validators.required]],
    type: ['SOCIAL' as EventType, [Validators.required]],
    maxParticipants: [null as number | null],
  }, { validators: [this.dateRangeValidator, this.startInFutureValidator] });

  dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.get('startDate')?.value;
    const startTime = control.get('startTimeStr')?.value;
    const endDate = control.get('endDate')?.value;
    const endTime = control.get('endTimeStr')?.value;
    
    if (startDate && startTime && endDate && endTime) {
      const start = new Date(startDate);
      const [sh, sm] = startTime.split(':').map(Number);
      start.setHours(sh, sm, 0, 0);
      
      const end = new Date(endDate);
      const [eh, em] = endTime.split(':').map(Number);
      end.setHours(eh, em, 0, 0);

      if (start >= end) {
        return { dateRangeInvalid: true };
      }
    }
    return null;
  }

  startInFutureValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.get('startDate')?.value;
    const startTime = control.get('startTimeStr')?.value;
    
    if (startDate && startTime) {
      const start = new Date(startDate);
      const [sh, sm] = startTime.split(':').map(Number);
      start.setHours(sh, sm, 0, 0);
      
      if (start <= new Date()) {
        return { startInPast: true };
      }
    }
    return null;
  }

  /** Returns a user-readable description of what needs to be fixed on the form */
  get formValidationMessage(): string {
    const f = this.newEventForm;
    if (f.get('title')?.errors?.['required']) return 'Title is required';
    if (f.get('title')?.errors?.['maxlength']) return 'Title is too long (max 100 chars)';
    if (f.get('description')?.errors?.['required']) return 'Description is required';
    if (f.get('location')?.errors?.['required']) return 'Location is required';
    if (f.get('startDate')?.errors?.['required']) return 'Start date is required';
    if (f.get('startTimeStr')?.errors?.['required']) return 'Start time is required';
    if (f.get('endDate')?.errors?.['required']) return 'End date is required';
    if (f.get('endTimeStr')?.errors?.['required']) return 'End time is required';
    if (f.errors?.['startInPast']) return 'Start date and time must be in the future';
    if (f.errors?.['dateRangeInvalid']) return 'End time must be after start time';
    return 'Please fill out all required fields';
  }

  /** Filter function for Material datepicker to disable past dates */
  dateFilter = (d: Date | null): boolean => {
    if (!d) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d >= today;
  };

  toggleForm(): void {
    this.showCreateForm.update(v => !v);
  }

  onSubmit(): void {
    if (this.newEventForm.invalid) {
      this.toastService.show(this.formValidationMessage, 'error');
      return;
    }
    
    this.isSubmitting.set(true);
    const fv = this.newEventForm.getRawValue();
    
    // Combine date + time into ISO strings
    const startDate = new Date(fv.startDate!);
    const [sh, sm] = fv.startTimeStr.split(':').map(Number);
    startDate.setHours(sh, sm, 0, 0);

    const endDate = new Date(fv.endDate!);
    const [eh, em] = fv.endTimeStr.split(':').map(Number);
    endDate.setHours(eh, em, 0, 0);

    this.eventsFacade.createEvent({
      title: fv.title,
      description: fv.description,
      location: fv.location,
      type: fv.type,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      maxParticipants: fv.maxParticipants === null ? undefined : fv.maxParticipants
    });
    
    this.newEventForm.reset({ type: 'SOCIAL' });
    this.showCreateForm.set(false);
    this.isSubmitting.set(false);
  }

  onDeleteEvent(id: string): void {
    this.eventsFacade.deleteEvent(id);
  }

  onJoinEvent(id: string): void {
    this.eventsFacade.joinEvent(id);
  }

  onLeaveEvent(id: string): void {
    this.eventsFacade.leaveEvent(id);
  }

  canDelete(creatorId: string): boolean {
    return this.authFacade.canManageResource(creatorId);
  }
}
