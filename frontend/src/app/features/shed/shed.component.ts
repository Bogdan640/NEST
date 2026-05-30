import { Component, inject, signal, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ShedFacade } from '../../store/shed/shed.facade';
import { AuthFacade } from '../../store/auth/auth.facade';
import { ResourceCardComponent } from './resource-card/resource-card.component';
import { ResourceType } from '../../core/models/resource.model';

@Component({
  selector: 'app-shed',
  standalone: true,
  imports: [ReactiveFormsModule, ResourceCardComponent],
  templateUrl: './shed.component.html',
  styleUrl: './shed.component.scss',
})
export class ShedComponent {
  private fb = inject(FormBuilder);
  private shedFacade = inject(ShedFacade);
  private authFacade = inject(AuthFacade);

  resources = this.shedFacade.resources;
  isLoading = this.shedFacade.isLoading;
  error = this.shedFacade.error;
  
  currentUser = this.authFacade.currentUser;

  showCreateForm = signal(false);
  activeTab = signal<'browse' | 'borrowed'>('browse');

  resourceTypes: ResourceType[] = ['TOOL', 'BOOK', 'OTHER'];

  newResourceForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    type: ['TOOL' as ResourceType, [Validators.required]],
  });

  /** Items available for browsing */
  browseItems = computed(() => this.resources());

  /** Items I'm currently borrowing (have an APPROVED reservation) */
  myBorrowedItems = computed(() => {
    const user = this.currentUser();
    if (!user) return [];
    return this.resources().filter(r =>
      r.reservations?.some(res => res.borrowerId === user.id && res.status === 'APPROVED')
    );
  });

  setTab(tab: 'browse' | 'borrowed'): void {
    this.activeTab.set(tab);
  }

  toggleForm(): void {
    this.showCreateForm.update(v => !v);
  }

  onSubmit(): void {
    if (this.newResourceForm.invalid) return;
    
    const formValue = this.newResourceForm.getRawValue();
    this.shedFacade.createResource(formValue);
    
    this.newResourceForm.reset({ type: 'TOOL' });
    this.showCreateForm.set(false);
  }

  onDeleteResource(id: string): void {
    this.shedFacade.deleteResource(id);
  }

  onReserveResource(event: {id: string, startTime: string, endTime: string}): void {
    this.shedFacade.reserveResource(event.id, { 
      startTime: event.startTime, 
      endTime: event.endTime 
    });
  }

  onReturnResource(id: string): void {
    this.shedFacade.returnResource(id);
  }

  canDelete(ownerId: string | null): boolean {
    const user = this.currentUser();
    return !!user && (user.id === ownerId || user.role === 'ADMIN');
  }
}
