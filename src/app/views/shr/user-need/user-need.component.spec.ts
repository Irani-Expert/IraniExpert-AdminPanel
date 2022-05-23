import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNeedComponent } from './user-need.component';

describe('UserNeedComponent', () => {
  let component: UserNeedComponent;
  let fixture: ComponentFixture<UserNeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserNeedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
