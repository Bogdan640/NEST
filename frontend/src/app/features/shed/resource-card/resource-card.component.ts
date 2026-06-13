import { Component, input, output, computed, signal, inject, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Resource } from '../../../core/models/resource.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ResourceAvailabilityNotificationService } from '../../../shared/services/resource-availability-notification.service';

@Component({
  selector: 'app-resource-card',
  standalone: true,
  imports: [ConfirmDialogComponent, MatDialogModule],
  templateUrl: './resource-card.component.html',
  styleUrl: './resource-card.component.scss',
})
export class ResourceCardComponent {
  private notificationService = inject(ResourceAvailabilityNotificationService);
  private dialog = inject(MatDialog);

  /** The resource to display */
  resource = input.required<Resource>();
  /** ID of the currently logged-in user */
  currentUserId = input<string | undefined>();
  /** Whether the current user can delete this resource */
  canDelete = input(false);
  /** When in "My Borrowed" tab, show return button for the borrower */
  borrowedMode = input(false);

  reserveClicked = output<{id: string, startTime: string, endTime: string}>();
  returnClicked = output<string>();
  deleteClicked = output<string>();

  showDeleteConfirm = signal(false);

  isBorrowedByMe = computed(() => {
    const userId = this.currentUserId();
    const reservations = this.resource().reservations;
    if (!userId || !reservations) return false;
    return reservations.some(
      r => r.borrowerId === userId && r.status === 'APPROVED'
    );
  });

  isOwner = computed(() => {
    const userId = this.currentUserId();
    return !!userId && userId === this.resource().ownerId;
  });

  isAvailable = computed(() => {
    const reservations = this.resource().reservations;
    if (!reservations) return true;
    return !reservations.some(r => r.status === 'APPROVED');
  });

  currentBorrower = computed(() => {
    const reservations = this.resource().reservations;
    if (!reservations) return null;
    return reservations.find(r => r.status === 'APPROVED')?.borrower ?? null;
  });

  isWatchingThisResource = computed(() => {
    return this.notificationService.watchedResourceIds().includes(this.resource().id);
  });

  onReserve(): void {
    const startTime = new Date().toISOString();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);
    const endTime = endDate.toISOString();

    this.reserveClicked.emit({ id: this.resource().id, startTime, endTime });
  }

  onReturn(): void {
    this.returnClicked.emit(this.resource().id);
  }

  onDelete(): void {
    this.showDeleteConfirm.set(true);
  }

  confirmDelete(): void {
    this.showDeleteConfirm.set(false);
    this.deleteClicked.emit(this.resource().id);
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
  }

  onToggleNotification(event: Event): void {
    event.stopPropagation();
    const id = this.resource().id;
    const name = this.resource().name;
    if (this.isWatchingThisResource()) {
      this.notificationService.unwatchResource(id);
    } else {
      this.notificationService.watchResource(id, name);
    }
  }

  openDetails(templateRef: TemplateRef<any>): void {
    this.dialog.open(templateRef, {
      panelClass: 'modal-dialog-panel',
      backdropClass: 'blurred-backdrop',
      maxWidth: '90vw',
      maxHeight: '90vh'
    });
  }

  getTruncatedDescription(desc: string, limit: number = 120): string {
    if (desc.length <= limit) return desc;
    const lastSpace = desc.lastIndexOf(' ', limit);
    return desc.slice(0, lastSpace > 0 ? lastSpace : limit);
  }
}
