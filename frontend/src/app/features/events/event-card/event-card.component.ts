import { Component, input, output, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NestEvent } from '../../../core/models/event.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [DatePipe, ConfirmDialogComponent],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss',
})
export class EventCardComponent {
  readonly event = input.required<NestEvent>();
  readonly currentUserId = input<string | undefined>();
  readonly canDelete = input(false);

  readonly joinClicked = output<string>();
  readonly leaveClicked = output<string>();
  readonly deleteClicked = output<string>();

  readonly showDeleteConfirm = signal(false);

  readonly isAttending = computed(() => {
    const userId = this.currentUserId();
    const attendees = this.event().attendees;
    if (!userId || !attendees) return false;
    return attendees.some(a => a.userId === userId);
  });

  readonly isCreator = computed(() => {
    return this.currentUserId() === this.event().creatorId;
  });

  readonly attendeeCount = computed(() => {
    return this.event().attendees?.length || 0;
  });

  readonly isFull = computed(() => {
    const max = this.event().maxParticipants;
    if (!max) return false;
    return this.attendeeCount() >= max;
  });

  onJoin(): void {
    this.joinClicked.emit(this.event().id);
  }

  onLeave(): void {
    this.leaveClicked.emit(this.event().id);
  }

  onDelete(): void {
    this.showDeleteConfirm.set(true);
  }

  confirmDelete(): void {
    this.showDeleteConfirm.set(false);
    this.deleteClicked.emit(this.event().id);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
  }
}
