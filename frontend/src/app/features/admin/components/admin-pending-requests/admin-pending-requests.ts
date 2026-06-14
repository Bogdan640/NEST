import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { JoinRequest } from '../../../../core/models/user.model';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-admin-pending-requests',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './admin-pending-requests.html',
  styleUrl: './admin-pending-requests.scss'
})
export class AdminPendingRequests {
  requests = input.required<JoinRequest[]>();
  
  approve = output<string>();
  reject = output<string>();

  getProfileImageUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${environment.apiBaseUrl}${path}`;
  }

  onApprove(userId: string) {
    this.approve.emit(userId);
  }

  onReject(userId: string) {
    this.reject.emit(userId);
  }
}
