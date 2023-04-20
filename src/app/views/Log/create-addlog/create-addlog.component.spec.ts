import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAddlogComponent } from './create-addlog.component';

describe('CreateAddlogComponent', () => {
  let component: CreateAddlogComponent;
  let fixture: ComponentFixture<CreateAddlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAddlogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAddlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
