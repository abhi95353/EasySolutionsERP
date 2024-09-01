import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentIdCardComponent } from './student-id-card.component';

describe('StudentIdCardComponent', () => {
  let component: StudentIdCardComponent;
  let fixture: ComponentFixture<StudentIdCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentIdCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentIdCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
