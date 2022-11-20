import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAsUserComponent } from './login-as-user.component';

describe('LoginAsUserComponent', () => {
  let component: LoginAsUserComponent;
  let fixture: ComponentFixture<LoginAsUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginAsUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginAsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
