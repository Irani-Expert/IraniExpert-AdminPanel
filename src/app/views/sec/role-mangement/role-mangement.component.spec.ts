import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleMangementComponent } from './role-mangement.component';

describe('RoleMangementComponent', () => {
  let component: RoleMangementComponent;
  let fixture: ComponentFixture<RoleMangementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleMangementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleMangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
