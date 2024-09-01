import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDataListComponent } from './student-data-list.component';

describe('StudentDataListComponent', () => {
  let component: StudentDataListComponent;
  let fixture: ComponentFixture<StudentDataListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentDataListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
