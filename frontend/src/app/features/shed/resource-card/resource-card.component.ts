import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Resource } from '../../../core/models/resource.model';

@Component({
  selector: 'app-resource-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './resource-card.component.html',
  styleUrl: './resource-card.component.scss',
})
export class ResourceCardComponent {
  @Input({ required: true }) resource!: Resource;
  @Input() currentUserId: string | undefined;
  @Input() canDelete = false;

  @Output() reserveClicked = new EventEmitter<{id: string, startTime: string, endTime: string}>();
  @Output() returnClicked = new EventEmitter<string>();
  @Output() deleteClicked = new EventEmitter<string>();

  get isBorrowedByMe(): boolean {
    if (!this.currentUserId || !this.resource.reservations) return false;
    return this.resource.reservations.some(
      r => r.borrowerId === this.currentUserId && r.status === 'APPROVED'
    );
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
    if (confirm('Are you sure you want to delete this resource?')) {
      this.deleteClicked.emit(this.resource.id);
    }
  }
}
