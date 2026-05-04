import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Resource } from '../../../core/models/resource.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-resource-card',
  standalone: true,
  imports: [ConfirmDialogComponent],
  templateUrl: './resource-card.component.html',
  styleUrl: './resource-card.component.scss',
})
export class ResourceCardComponent {
  @Input({ required: true }) resource!: Resource;
  @Input() currentUserId: string | undefined;
  @Input() canDelete = false;
  /** When in "My Borrowed" tab, show return button for the borrower */
  @Input() borrowedMode = false;

  @Output() reserveClicked = new EventEmitter<{id: string, startTime: string, endTime: string}>();
  @Output() returnClicked = new EventEmitter<string>();
  @Output() deleteClicked = new EventEmitter<string>();

  showDeleteConfirm = false;

  get isBorrowedByMe(): boolean {
    if (!this.currentUserId || !this.resource.reservations) return false;
    return this.resource.reservations.some(
      r => r.borrowerId === this.currentUserId && r.status === 'APPROVED'
    );
  }

  get isOwner(): boolean {
    return !!this.currentUserId && this.currentUserId === this.resource.ownerId;
  }

  get isAvailable(): boolean {
    if (!this.resource.reservations) return true;
    return !this.resource.reservations.some(r => r.status === 'APPROVED');
  }

  get currentBorrower() {
    if (!this.resource.reservations) return null;
    return this.resource.reservations.find(r => r.status === 'APPROVED')?.borrower;
  }

  onReserve(): void {
    const startTime = new Date().toISOString();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);
    const endTime = endDate.toISOString();

    this.reserveClicked.emit({ id: this.resource.id, startTime, endTime });
  }

  onReturn(): void {
    this.returnClicked.emit(this.resource.id);
  }

  onDelete(): void {
    this.showDeleteConfirm = true;
  }

  confirmDelete(): void {
    this.showDeleteConfirm = false;
    this.deleteClicked.emit(this.resource.id);
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }
}
