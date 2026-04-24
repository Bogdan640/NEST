import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { AuthFacade } from '../../store/auth/auth.facade';

@Directive({
  selector: '[appIfRole]',
  standalone: true
})
export class RoleDirective {
  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private authFacade = inject(AuthFacade);
  
  private requiredRole: string | null = null;
  private hasView = false;

  @Input() set appIfRole(role: string) {
    this.requiredRole = role;
    this.updateView();
  }

  constructor() {
    effect(() => {
      this.updateView();
    });
  }

  private updateView() {
    const user = this.authFacade.currentUser();
    const condition = user && user.role === this.requiredRole;

    if (condition && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
