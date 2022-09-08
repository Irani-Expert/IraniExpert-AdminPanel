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
  @Input('appCanAccess') privilege: string;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authenticationService: AuthenticateService
  ) {}
  ngOnInit(): void {
    debugger;
    const privileges = this.authenticationService.currentUserValue.privileges;
    let isPrivilegeValid = privileges.find((item) => item == this.privilege);
    if (isPrivilegeValid) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
