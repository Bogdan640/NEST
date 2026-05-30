import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  template: `
    @if (isOpen()) {
      <div class="overlay" (click)="onCancel()">
        <div class="dialog" (click)="$event.stopPropagation()">
          <div class="dialog-icon">{{ icon() }}</div>
          <h3 class="dialog-title">{{ title() }}</h3>
          <p class="dialog-message">{{ message() }}</p>
          <div class="dialog-actions">
            <button class="btn-cancel" (click)="onCancel()">Cancel</button>
            <button class="btn-confirm" [class.danger]="danger()" (click)="onConfirm()">
              {{ confirmText() }}
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
      background: var(--card-bg);
      border-radius: 1.25rem;
      padding: 2rem;
      max-width: 400px;
      width: 90%;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      animation: scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      border: 1px solid var(--card-border);
    }

    .dialog-icon {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }

    .dialog-title {
      margin: 0 0 0.5rem;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-text-primary);
    }

    .dialog-message {
      margin: 0 0 1.5rem;
      color: var(--color-text-tertiary);
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
      background: var(--btn-secondary-bg);
      color: var(--btn-secondary-color);

      &:hover { background: var(--btn-secondary-hover-bg); }
    }

    .btn-confirm {
      background: var(--btn-primary-bg);
      color: var(--color-text-inverted);

      &:hover { background: var(--btn-primary-hover); }

      &.danger {
        background: var(--color-danger);
        &:hover { background: var(--color-danger-hover); }
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
