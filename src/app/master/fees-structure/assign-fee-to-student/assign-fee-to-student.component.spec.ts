import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignFeeToStudentComponent } from './assign-fee-to-student.component';

describe('AssignFeeToStudentComponent', () => {
  let component: AssignFeeToStudentComponent;
  let fixture: ComponentFixture<AssignFeeToStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignFeeToStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignFeeToStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
