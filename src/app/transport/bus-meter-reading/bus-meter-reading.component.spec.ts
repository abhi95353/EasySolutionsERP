import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusMeterReadingComponent } from './bus-meter-reading.component';

describe('BusMeterReadingComponent', () => {
  let component: BusMeterReadingComponent;
  let fixture: ComponentFixture<BusMeterReadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusMeterReadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusMeterReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
