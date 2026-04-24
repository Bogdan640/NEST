import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ParkingAnnouncement } from '../../../core/models/parking.model';

@Component({
  selector: 'app-parking-card',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './parking-card.component.html',
  styleUrl: './parking-card.component.scss',
})
export class ParkingCardComponent {
  @Input({ required: true }) announcement!: ParkingAnnouncement;
  @Input() currentUserId: string | undefined;
  @Input() canDelete = false;

  @Output() applyClicked = new EventEmitter<string>();
  @Output() approveClicked = new EventEmitter<string>();
  @Output() deleteClicked = new EventEmitter<string>();

  get hasApplied(): boolean {
    if (!this.currentUserId || !this.announcement.applications) return false;
    return this.announcement.applications.some(a => a.applicantId === this.currentUserId);
  }

  get isMyAnnouncement(): boolean {
    return this.currentUserId === this.announcement.publisherId;
  }

  get approvedApplication() {
    if (!this.announcement.applications) return null;
    return this.announcement.applications.find(a => a.status === 'APPROVED');
  }

  get isAvailable(): boolean {
    return !this.approvedApplication && new Date(this.announcement.availableTo) > new Date();
  }

  onApply(): void {
    this.applyClicked.emit(this.announcement.id);
  }

  onApprove(applicationId: string): void {
    this.approveClicked.emit(applicationId);
  }

  onDelete(): void {
    if (confirm('Are you sure you want to remove this announcement?')) {
      this.deleteClicked.emit(this.announcement.id);
    }
  }
}
