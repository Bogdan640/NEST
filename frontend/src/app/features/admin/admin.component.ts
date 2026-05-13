import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminApiService, BlockResident } from '../../core/api/admin-api.service';
import { JoinRequest } from '../../core/models/user.model';
import { ToastService } from '../../shared/services/toast.service';
import { DatePipe } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, GridReadyEvent, GridApi, ICellRendererParams } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [DatePipe, AgGridAngular],
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

  private gridApi!: GridApi;

  // AG Grid theme
  theme = themeQuartz.withParams({
    accentColor: '#059669',
    backgroundColor: '#ffffff',
    borderColor: '#d1fae5',
    browserColorScheme: 'light',
    chromeBackgroundColor: '#ecfdf5',
    foregroundColor: '#111827',
    headerBackgroundColor: '#ecfdf5',
    headerFontSize: 13,
    headerFontWeight: 600,
    headerTextColor: '#064e3b',
    rowBorder: { color: '#f3f4f6', style: 'solid', width: 1 },
    oddRowBackgroundColor: '#f0fdf9',
    borderRadius: 8,
    wrapperBorderRadius: 12,
    cellHorizontalPaddingScale: 1,
    spacing: 6,
    fontSize: 13,
  });

  columnDefs: ColDef[] = [
    {
      headerName: '',
      field: 'profileImage',
      width: 64,
      sortable: false,
      filter: false,
      cellRenderer: (params: ICellRendererParams) => {
        const data = params.data as BlockResident;
        if (data.profileImage) {
          return `<div style="display:flex;align-items:center;justify-content:center;height:100%;">
            <img src="${data.profileImage}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;" />
          </div>`;
        }
        const initials = `${data.firstName?.charAt(0) || ''}${data.lastName?.charAt(0) || ''}`.toUpperCase();
        return `<div style="display:flex;align-items:center;justify-content:center;height:100%;">
          <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#059669,#34d399);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;letter-spacing:0.5px;">${initials}</div>
        </div>`;
      },
    },
    {
      headerName: 'Full Name',
      valueGetter: (params) => `${params.data.firstName} ${params.data.lastName}`,
      flex: 1.2,
      minWidth: 160,
      cellRenderer: (params: ICellRendererParams) => {
        const data = params.data as BlockResident;
        const role = data.role === 'ADMIN'
          ? `<span style="margin-left:6px;font-size:10px;padding:2px 6px;border-radius:9999px;background:#fef3c7;color:#d97706;font-weight:600;">ADMIN</span>`
          : '';
        return `<div style="display:flex;align-items:center;height:100%;">
          <span style="font-weight:600;color:#111827;">${data.firstName} ${data.lastName}</span>${role}
        </div>`;
      },
    },
    {
      headerName: 'Email',
      field: 'email',
      flex: 1.4,
      minWidth: 200,
      cellRenderer: (params: ICellRendererParams) => {
        return `<div style="display:flex;align-items:center;height:100%;color:#4b5563;">
          <span style="margin-right:6px;">✉️</span>${params.value}
        </div>`;
      },
    },
    {
      headerName: 'Apt.',
      field: 'apartmentNumber',
      width: 80,
      cellRenderer: (params: ICellRendererParams) => {
        return `<div style="display:flex;align-items:center;justify-content:center;height:100%;">
          <span style="background:#ecfdf5;color:#059669;padding:2px 8px;border-radius:6px;font-weight:600;font-size:12px;">${params.value || '—'}</span>
        </div>`;
      },
    },
    {
      headerName: 'Active Events',
      field: 'activeEventsCreated',
      flex: 1,
      minWidth: 140,
      sortable: true,
      comparator: (a: any[], b: any[]) => (a?.length || 0) - (b?.length || 0),
      cellRenderer: (params: ICellRendererParams) => {
        const events = params.value as { id: string; title: string }[];
        if (!events || events.length === 0) {
          return `<div style="display:flex;align-items:center;height:100%;color:#9ca3af;font-style:italic;">No active events</div>`;
        }
        const chips = events.map(e =>
          `<span style="display:inline-block;background:#d1fae5;color:#065f46;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:500;margin:1px 2px;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${e.title}">${e.title}</span>`
        ).join('');
        return `<div style="display:flex;align-items:center;flex-wrap:wrap;gap:2px;height:100%;padding:4px 0;">${chips}</div>`;
      },
    },
    {
      headerName: 'Participating In',
      field: 'eventsParticipating',
      flex: 1,
      minWidth: 140,
      sortable: true,
      comparator: (a: any[], b: any[]) => (a?.length || 0) - (b?.length || 0),
      cellRenderer: (params: ICellRendererParams) => {
        const events = params.value as { id: string; title: string }[];
        if (!events || events.length === 0) {
          return `<div style="display:flex;align-items:center;height:100%;color:#9ca3af;font-style:italic;">Not participating</div>`;
        }
        const chips = events.map(e =>
          `<span style="display:inline-block;background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:500;margin:1px 2px;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${e.title}">${e.title}</span>`
        ).join('');
        return `<div style="display:flex;align-items:center;flex-wrap:wrap;gap:2px;height:100%;padding:4px 0;">${chips}</div>`;
      },
    },
    {
      headerName: 'Borrowed Tools',
      field: 'borrowedTools',
      flex: 1,
      minWidth: 140,
      sortable: true,
      comparator: (a: any[], b: any[]) => (a?.length || 0) - (b?.length || 0),
      cellRenderer: (params: ICellRendererParams) => {
        const tools = params.value as { id: string; name: string; type: string }[];
        if (!tools || tools.length === 0) {
          return `<div style="display:flex;align-items:center;height:100%;color:#9ca3af;font-style:italic;">No borrowed tools</div>`;
        }
        const chips = tools.map(t =>
          `<span style="display:inline-block;background:#ede9fe;color:#5b21b6;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:500;margin:1px 2px;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${t.name} (${t.type})">${t.name}</span>`
        ).join('');
        return `<div style="display:flex;align-items:center;flex-wrap:wrap;gap:2px;height:100%;padding:4px 0;">${chips}</div>`;
      },
    },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    filter: true,
  };

  ngOnInit() {
    this.loadPendingUsers();
    this.loadResidents();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  onFilterChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.quickFilterText.set(input.value);
  }

  setTab(tab: 'residents' | 'pending') {
    this.activeTab.set(tab);
  }

  loadResidents() {
    this.isResidentsLoading.set(true);
    this.adminApi.getBlockResidents().subscribe({
      next: (residents) => {
        this.residents.set(residents);
        this.isResidentsLoading.set(false);
      },
      error: (err) => {
        this.toastService.show(err.error?.message || 'Failed to load residents', 'error');
        this.isResidentsLoading.set(false);
      }
    });
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
        this.loadResidents();
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
