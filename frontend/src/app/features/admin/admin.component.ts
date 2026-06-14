import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminApiService, BlockResident } from '../../core/api/admin-api.service';
import { JoinRequest } from '../../core/models/user.model';
import { ToastService } from '../../shared/services/toast.service';
import { AdminResidentsGrid } from './components/admin-residents-grid/admin-residents-grid';
import { AdminPendingRequests } from './components/admin-pending-requests/admin-pending-requests';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [AdminResidentsGrid, AdminPendingRequests],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  private adminApi = inject(AdminApiService);
  private toastService = inject(ToastService);

  pendingRequests = signal<JoinRequest[]>([]);
  residents = signal<BlockResident[]>([]);
  isLoading = signal(true);
  isResidentsLoading = signal(true);
  quickFilterText = signal('');
  activeTab = signal<'residents' | 'pending'>('residents');

  ngOnInit() {
    this.loadPendingRequests();
    this.loadBlockResidents();
  }

  loadPendingRequests() {
    this.isLoading.set(true);
    this.adminApi.getPendingUsers().subscribe({
      next: (requests) => {
        this.pendingRequests.set(requests);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toastService.show(err.error?.message || 'Failed to load pending requests', 'error');
        this.isLoading.set(false);
      }
    });
  }

  loadBlockResidents() {
    this.isResidentsLoading.set(true);
    this.adminApi.getBlockResidents().subscribe({
      next: (residents) => {
        this.residents.set(residents);
        this.isResidentsLoading.set(false);
      },
      error: (err) => {
        this.toastService.show(err.error?.message || 'Failed to load block residents', 'error');
        this.isResidentsLoading.set(false);
      }
    });
  }

  onFilterChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.quickFilterText.set(input.value);
  }

  setTab(tab: 'residents' | 'pending') {
    this.activeTab.set(tab);
  }
  approveRequest(userId: string) {
    this.adminApi.approveUser(userId).subscribe({
      next: () => {
        this.toastService.show('User approved successfully', 'success');
        this.loadPendingRequests();
        this.loadBlockResidents();
      },
      error: (err) => this.toastService.show(err.error?.message || 'Failed to approve', 'error')
    });
  }

  rejectRequest(userId: string) {
    this.adminApi.rejectUser(userId).subscribe({
      next: () => {
        this.toastService.show('User rejected successfully', 'info');
        this.loadPendingRequests();
      },
      error: (err) => this.toastService.show(err.error?.message || 'Failed to reject', 'error')
    });
  }
}
