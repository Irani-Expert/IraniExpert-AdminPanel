import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowLogsComponent } from './show-logs.component';

describe('ShowLogsComponent', () => {
  let component: ShowLogsComponent;
  let fixture: ComponentFixture<ShowLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowLogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
