import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  readonly isOpen = input(false);
  readonly title = input('Are you sure?');
  readonly message = input('This action cannot be undone.');
  readonly confirmText = input('Confirm');
  readonly icon = input('⚠️');
  readonly danger = input(true);

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
