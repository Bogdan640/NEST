import { Component, inject, signal } from '@angular/core';
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
  isSubmitting = signal(false);

  resourceTypes: ResourceType[] = ['TOOL', 'BOOK', 'OTHER'];

  newResourceForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    type: ['TOOL' as ResourceType, [Validators.required]],
  });

  toggleForm(): void {
    this.showCreateForm.update(v => !v);
  }

  onSubmit(): void {
    if (this.newResourceForm.invalid) return;
    
    this.isSubmitting.set(true);
    const formValue = this.newResourceForm.getRawValue();
    
    this.shedFacade.createResource(formValue);
    
    this.newResourceForm.reset({ type: 'TOOL' });
    this.showCreateForm.set(false);
    this.isSubmitting.set(false);
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
