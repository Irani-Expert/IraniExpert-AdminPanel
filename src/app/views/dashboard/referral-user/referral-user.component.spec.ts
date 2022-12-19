import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralUserComponent } from './referral-user.component';

describe('ReferralUserComponent', () => {
  let component: ReferralUserComponent;
  let fixture: ComponentFixture<ReferralUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferralUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
