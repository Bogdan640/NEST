import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input({ required: true }) event!: NestEvent;
  @Input() currentUserId: string | undefined;
  @Input() canDelete = false;

  @Output() joinClicked = new EventEmitter<string>();
  @Output() leaveClicked = new EventEmitter<string>();
  @Output() deleteClicked = new EventEmitter<string>();

  showDeleteConfirm = false;

  get isAttending(): boolean {
    if (!this.currentUserId || !this.event.attendees) return false;
    return this.event.attendees.some(a => a.userId === this.currentUserId);
  }

  get isCreator(): boolean {
    return this.currentUserId === this.event.creatorId;
  }

  get attendeeCount(): number {
    return this.event.attendees?.length || 0;
  }

  get isFull(): boolean {
    if (!this.event.maxParticipants) return false;
    return this.attendeeCount >= this.event.maxParticipants;
  }

  onJoin(): void {
    this.joinClicked.emit(this.event.id);
  }

  onLeave(): void {
    this.leaveClicked.emit(this.event.id);
  }

  onDelete(): void {
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    this.showDeleteConfirm = false;
    this.deleteClicked.emit(this.event.id);
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }
}
