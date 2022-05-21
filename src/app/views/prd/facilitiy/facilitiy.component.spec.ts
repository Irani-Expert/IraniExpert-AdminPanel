import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilitiyComponent } from './facilitiy.component';

describe('FacilitiyComponent', () => {
  let component: FacilitiyComponent;
  let fixture: ComponentFixture<FacilitiyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacilitiyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilitiyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
