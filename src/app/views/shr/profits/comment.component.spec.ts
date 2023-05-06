import { ComponentFixture, TestBed } from '@angular/core/testing';

import { commentComponent } from './profits.component';

describe('ProfitsComponent', () => {
  let component: commentComponent;
  let fixture: ComponentFixture<commentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ commentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(commentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
