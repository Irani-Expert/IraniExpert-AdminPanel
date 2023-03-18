import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCommissionComponent } from './all-commission.component';

describe('AllCommissionComponent', () => {
  let component: AllCommissionComponent;
  let fixture: ComponentFixture<AllCommissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCommissionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
