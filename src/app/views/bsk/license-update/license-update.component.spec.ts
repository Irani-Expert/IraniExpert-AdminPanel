import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseUpdateComponent } from './license-update.component';

describe('LicenseUpdateComponent', () => {
  let component: LicenseUpdateComponent;
  let fixture: ComponentFixture<LicenseUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicenseUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LicenseUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
