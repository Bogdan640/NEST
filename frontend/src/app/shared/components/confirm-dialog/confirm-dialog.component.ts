import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    @if (isOpen) {
      <div class="overlay" (click)="onCancel()">
        <div class="dialog" (click)="$event.stopPropagation()">
          <div class="dialog-icon">{{ icon }}</div>
          <h3 class="dialog-title">{{ title }}</h3>
          <p class="dialog-message">{{ message }}</p>
          <div class="dialog-actions">
            <button class="btn-cancel" (click)="onCancel()">Cancel</button>
            <button class="btn-confirm" [class.danger]="danger" (click)="onConfirm()">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.15s ease-out;
    }

    .dialog {
      background: #ffffff;
      border-radius: 1.25rem;
      padding: 2rem;
      max-width: 400px;
      width: 90%;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      animation: scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .dialog-icon {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }

    .dialog-title {
      margin: 0 0 0.5rem;
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
    }

    .dialog-message {
      margin: 0 0 1.5rem;
      color: #6b7280;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .dialog-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
    }

    .btn-cancel, .btn-confirm {
      padding: 0.625rem 1.5rem;
      border-radius: 0.625rem;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }

    .btn-cancel {
      background: #f3f4f6;
      color: #4b5563;

      &:hover { background: #e5e7eb; }
    }

    .btn-confirm {
      background: #059669;
      color: white;

      &:hover { background: #047857; }

      &.danger {
        background: #ef4444;
        &:hover { background: #dc2626; }
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes scaleIn {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `]
})
export class ConfirmDialogComponent {
  @Input() isOpen = false;
  @Input() title = 'Are you sure?';
  @Input() message = 'This action cannot be undone.';
  @Input() confirmText = 'Confirm';
  @Input() icon = '⚠️';
  @Input() danger = true;

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
