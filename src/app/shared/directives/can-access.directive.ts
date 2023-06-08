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
  @Input('appCanAccess') privilege: any;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authenticationService: AuthenticateService
  ) {}
  ngOnInit(): void {
    this.checkCanAccess(this.privilege);
  }
  checkCanAccess(privs) {
    const privileges = this.authenticationService.currentUserValue.privileges;
    if (typeof privs == 'object') {
      let Valid = false;
      privileges.find((item) => {
        privs.forEach((it) => {
          if (item == it) {
            Valid = true;
            return;
          }
        });
      });
      if (Valid) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    }
    if (typeof privs == 'string') {
      let isPrivilegeValid = privileges.find((item) => item == privs);
      if (isPrivilegeValid) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    }
  }
}
