import { Component, input, signal, TemplateRef, ViewChild, inject } from '@angular/core';
import { BlockResident } from '../../../../core/api/admin-api.service';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef, GridReadyEvent, GridApi, ICellRendererParams, CellClickedEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { environment } from '../../../../../environments/environment';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-admin-residents-grid',
  standalone: true,
  imports: [AgGridAngular, MatDialogModule],
  templateUrl: './admin-residents-grid.html',
  styleUrl: './admin-residents-grid.scss'
})
export class AdminResidentsGrid {
  residents = input.required<BlockResident[]>();
  quickFilterText = input<string>('');

  private dialog = inject(MatDialog);
  private gridApi!: GridApi;

  @ViewChild('listDialog') listDialogTemplate!: TemplateRef<any>;

  dialogTitle = signal('');
  dialogItems = signal<{ id: string, name: string, subtitle?: string }[]>([]);

  getProfileImageUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${environment.apiBaseUrl}${path}`;
  }

  theme = themeQuartz.withParams({
    accentColor: '#059669',
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
    borderRadius: 8,
    headerBackgroundColor: '#f9fafb',
    headerTextColor: '#374151',
    headerFontSize: 13,
    headerFontWeight: 600,
    rowBorder: { color: '#e5e7eb', style: 'solid', width: 1 },
    cellTextColor: '#111827',
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
          const imgUrl = data.profileImage.startsWith('http') ? data.profileImage : `${environment.apiBaseUrl}${data.profileImage}`;
          return `<div style="display:flex;align-items:center;justify-content:center;height:100%;">
            <img src="${imgUrl}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;" />
          </div>`;
        }
        const initials = `${data.firstName?.charAt(0) || ''}${data.lastName?.charAt(0) || ''}`.toUpperCase();
        return `<div style="display:flex;align-items:center;justify-content:center;height:100%;">
          <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#059669,#34d399);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;letter-spacing:0.5px;">${initials}</div>
        </div>`;
      },
    },
    { headerName: 'First Name', field: 'firstName', flex: 1, minWidth: 120 },
    { headerName: 'Last Name', field: 'lastName', flex: 1, minWidth: 120 },
    { headerName: 'Apt.', field: 'apartmentNumber', width: 90 },
    { headerName: 'Role', field: 'role', width: 100 },
    {
      headerName: 'Joined',
      field: 'createdAt',
      width: 120,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      },
    },
    {
      headerName: 'Active Events',
      field: 'activeEventsCreated',
      flex: 1,
      minWidth: 140,
      sortable: true,
      comparator: (a: any[], b: any[]) => (a?.length || 0) - (b?.length || 0),
      cellStyle: (params) => params.value && params.value.length > 0 ? { cursor: 'pointer' } : null,
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
      cellStyle: (params) => params.value && params.value.length > 0 ? { cursor: 'pointer' } : null,
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
      cellStyle: (params) => params.value && params.value.length > 0 ? { cursor: 'pointer' } : null,
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

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onCellClicked(event: CellClickedEvent) {
    if (!event.value || event.value.length === 0) return;

    if (['activeEventsCreated', 'eventsParticipating', 'borrowedTools'].includes(event.colDef.field!)) {
      let title = '';
      let items: any[] = [];
      
      if (event.colDef.field === 'activeEventsCreated') {
        title = 'Active Events';
        items = event.value.map((e: any) => ({ id: e.id, name: e.title }));
      } else if (event.colDef.field === 'eventsParticipating') {
        title = 'Participating In';
        items = event.value.map((e: any) => ({ id: e.id, name: e.title }));
      } else if (event.colDef.field === 'borrowedTools') {
        title = 'Borrowed Tools';
        items = event.value.map((t: any) => ({ id: t.id, name: t.name, subtitle: t.type }));
      }
      
      this.dialogTitle.set(title);
      this.dialogItems.set(items);
      
      this.dialog.open(this.listDialogTemplate, {
        panelClass: 'modal-dialog-panel',
        backdropClass: 'blurred-backdrop',
        maxWidth: '400px',
        width: '90vw'
      });
    }
  }
}
