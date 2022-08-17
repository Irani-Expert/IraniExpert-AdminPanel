import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AuthenticateService } from '../services/auth/authenticate.service';

@Directive({
  selector: '[appCanAccess]',
})
export class CanAccessDirective implements OnInit {
  @Input('appCanAccess')
  role: string;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authenticationService: AuthenticateService
  ) {}
  ngOnInit(): void {
    const isRoleValid = this.authenticationService.currentUserValue.subject;
    if (isRoleValid == this.role) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
