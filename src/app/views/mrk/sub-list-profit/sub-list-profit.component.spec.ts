import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubListProfitComponent } from './sub-list-profit.component';

describe('SubListProfitComponent', () => {
  let component: SubListProfitComponent;
  let fixture: ComponentFixture<SubListProfitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubListProfitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubListProfitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
