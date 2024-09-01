import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeTransportReportComponent } from './fee-transport-report.component';

describe('FeeTransportReportComponent', () => {
  let component: FeeTransportReportComponent;
  let fixture: ComponentFixture<FeeTransportReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeTransportReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeTransportReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
