import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-animal-logo',
  standalone: true,
  template: `
    <div class="animal-logo" [class]="size">
      <div class="icon-container">
        @if (animal === 'BIRD') {
          <span class="icon">🐦</span>
        } @else if (animal === 'BEAR') {
          <span class="icon">🐻</span>
        } @else if (animal === 'FOX') {
          <span class="icon">🦊</span>
        } @else {
          <span class="icon">🦝</span>
        }
      </div>
      <div class="brand">
        <span class="name">NEST</span>
        <span class="subtitle">Community</span>
      </div>
    </div>
  `,
  styles: [`
    .animal-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;

      &.small {
        .icon-container { width: 2rem; height: 2rem; font-size: 1.25rem; }
        .name { font-size: 1.25rem; }
        .subtitle { font-size: 0.65rem; }
      }

      &.medium {
        .icon-container { width: 3rem; height: 3rem; font-size: 1.75rem; }
        .name { font-size: 1.75rem; }
        .subtitle { font-size: 0.875rem; }
      }

      &.large {
        .icon-container { width: 4rem; height: 4rem; font-size: 2.5rem; }
        .name { font-size: 2.5rem; }
        .subtitle { font-size: 1.125rem; }
      }
    }

    .icon-container {
      background: #d1fae5;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
    }

    .brand {
      display: flex;
      flex-direction: column;
    }

    .name {
      font-weight: 900;
      color: #064e3b;
      line-height: 1;
      letter-spacing: -0.05em;
    }

    .subtitle {
      color: #059669;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      line-height: 1;
    }
  `]
})
export class AnimalLogoComponent {
  @Input() animal: 'BIRD' | 'BEAR' | 'FOX' | 'RACCOON' = 'BIRD';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
}
