import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminApiService } from '../../core/api/admin-api.service';
import { JoinRequest } from '../../core/models/user.model';
import { ToastService } from '../../shared/services/toast.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  private adminApi = inject(AdminApiService);
  private toastService = inject(ToastService);

  pendingRequests = signal<JoinRequest[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.loadPendingUsers();
  }

  loadPendingUsers() {
    this.isLoading.set(true);
    this.adminApi.getPendingUsers().subscribe({
      next: (requests) => {
        this.pendingRequests.set(requests);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toastService.show(err.error?.message || 'Failed to load pending users', 'error');
        this.isLoading.set(false);
      }
    });
  }

  approve(request: JoinRequest) {
    this.adminApi.approveUser(request.userId).subscribe({
      next: () => {
        this.toastService.show(`Approved ${request.user?.firstName || 'User'}`, 'success');
        this.loadPendingUsers();
      },
      error: (err) => this.toastService.show(err.error?.message || 'Failed to approve', 'error')
    });
  }

  reject(request: JoinRequest) {
    this.adminApi.rejectUser(request.userId).subscribe({
      next: () => {
        this.toastService.show(`Rejected ${request.user?.firstName || 'User'}`, 'info');
        this.loadPendingUsers();
      },
      error: (err) => this.toastService.show(err.error?.message || 'Failed to reject', 'error')
    });
  }
}
