import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ title() }}</h1>
        @if (subtitle()) {
          <p class="page-subtitle">{{ subtitle() }}</p>
        }
      </div>
      <div class="actions">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 800;
      color: var(--page-title-color);
      margin: 0 0 0.5rem;
    }

    .page-subtitle {
      color: var(--page-subtitle-color);
      font-size: 1.125rem;
      margin: 0;
    }

    .actions {
      display: flex;
      gap: 1rem;
    }
  `]
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
}
