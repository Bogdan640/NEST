import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthFacade } from '../../../store/auth/auth.facade';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authFacade = inject(AuthFacade);

  isLoading = this.authFacade.isLoading;
  error = this.authFacade.error;

  registerForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    apartmentNumber: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    const { email, password, firstName, lastName, apartmentNumber } = this.registerForm.getRawValue();
    this.authFacade.register(email, password, firstName, lastName, apartmentNumber);
  }
}
