import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesExcelReportComponent } from './fees-excel-report.component';

describe('FeesExcelReportComponent', () => {
  let component: FeesExcelReportComponent;
  let fixture: ComponentFixture<FeesExcelReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeesExcelReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeesExcelReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
