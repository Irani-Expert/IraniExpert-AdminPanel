import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCommentComponent } from './all-comment.component';

describe('AllCommentComponent', () => {
  let component: AllCommentComponent;
  let fixture: ComponentFixture<AllCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCommentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
