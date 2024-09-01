import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FineReportComponent } from './fine-report.component';

describe('FineReportComponent', () => {
  let component: FineReportComponent;
  let fixture: ComponentFixture<FineReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FineReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FineReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
