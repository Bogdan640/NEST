import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { EventsFacade } from '../../store/events/events.facade';
import { AuthFacade } from '../../store/auth/auth.facade';
import { EventCardComponent } from './event-card/event-card.component';
import { EventType } from '../../core/models/event.model';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [ReactiveFormsModule, EventCardComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent {
  private fb = inject(FormBuilder);
  private eventsFacade = inject(EventsFacade);
  private authFacade = inject(AuthFacade);

  events = this.eventsFacade.events;
  isLoading = this.eventsFacade.isLoading;
  error = this.eventsFacade.error;
  
  currentUser = this.authFacade.currentUser;

  showCreateForm = signal(false);
  isSubmitting = signal(false);

  eventTypes: EventType[] = ['SOCIAL', 'MEETING', 'MAINTENANCE', 'OTHER'];

  newEventForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    location: ['', [Validators.required]],
    startTime: ['', [Validators.required]],
    endTime: ['', [Validators.required]],
    type: ['SOCIAL' as EventType, [Validators.required]],
    maxParticipants: [null as number | null],
  });

  toggleForm(): void {
    this.showCreateForm.update(v => !v);
  }

  onSubmit(): void {
    if (this.newEventForm.invalid) return;
    
    this.isSubmitting.set(true);
    const formValue = this.newEventForm.getRawValue();
    
    this.eventsFacade.createEvent(formValue);
    
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
    const user = this.currentUser();
    return !!user && (user.id === creatorId || user.role === 'ADMIN');
  }
}
