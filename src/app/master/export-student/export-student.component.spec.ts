import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportStudentComponent } from './export-student.component';

describe('ExportStudentComponent', () => {
  let component: ExportStudentComponent;
  let fixture: ComponentFixture<ExportStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
