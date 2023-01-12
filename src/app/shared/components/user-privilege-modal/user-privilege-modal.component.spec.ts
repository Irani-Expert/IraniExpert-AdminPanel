import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPrivilegeModalComponent } from './user-privilege-modal.component';

describe('UserPrivilegeModalComponent', () => {
  let component: UserPrivilegeModalComponent;
  let fixture: ComponentFixture<UserPrivilegeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPrivilegeModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPrivilegeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
