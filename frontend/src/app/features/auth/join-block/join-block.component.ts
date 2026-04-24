import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthFacade } from '../../../store/auth/auth.facade';

@Component({
  selector: 'app-join-block',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './join-block.component.html',
  styleUrl: './join-block.component.scss',
})
export class JoinBlockComponent {
  private fb = inject(FormBuilder);
  private authFacade = inject(AuthFacade);

  isLoading = this.authFacade.isLoading;
  error = this.authFacade.error;

  joinForm = this.fb.nonNullable.group({
    blockCode: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.joinForm.invalid) return;
    const { blockCode } = this.joinForm.getRawValue();
    this.authFacade.joinBlock(blockCode);
  }
}
