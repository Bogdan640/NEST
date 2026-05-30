import { Component, input, output, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ParkingAnnouncement } from '../../../core/models/parking.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-parking-card',
  standalone: true,
  imports: [DatePipe, ConfirmDialogComponent],
  templateUrl: './parking-card.component.html',
  styleUrl: './parking-card.component.scss',
})
export class ParkingCardComponent {
  readonly announcement = input.required<ParkingAnnouncement>();
  readonly currentUserId = input<string | undefined>();
  readonly canDelete = input(false);

  readonly applyClicked = output<string>();
  readonly approveClicked = output<string>();
  readonly deleteClicked = output<string>();

  readonly showDeleteConfirm = signal(false);

  readonly hasApplied = computed(() => {
    const userId = this.currentUserId();
    const apps = this.announcement().applications;
    if (!userId || !apps) return false;
    return apps.some(a => a.applicantId === userId);
  });

  readonly isMyAnnouncement = computed(() => {
    return this.currentUserId() === this.announcement().publisherId;
  });

  readonly approvedApplication = computed(() => {
    const apps = this.announcement().applications;
    if (!apps) return null;
    return apps.find(a => a.status === 'APPROVED') ?? null;
  });

  readonly isAvailable = computed(() => {
    return !this.approvedApplication() && new Date(this.announcement().availableTo) > new Date();
  });

  onApply(): void {
    this.applyClicked.emit(this.announcement().id);
  }

  onApprove(applicationId: string): void {
    this.approveClicked.emit(applicationId);
  }

  onDelete(): void {
    this.showDeleteConfirm.set(true);
  }

  confirmDelete(): void {
    this.showDeleteConfirm.set(false);
    this.deleteClicked.emit(this.announcement().id);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
  }
}
