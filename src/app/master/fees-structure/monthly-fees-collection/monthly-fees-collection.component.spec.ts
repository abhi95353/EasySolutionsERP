import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyFeesCollectionComponent } from './monthly-fees-collection.component';

describe('MonthlyFeesCollectionComponent', () => {
  let component: MonthlyFeesCollectionComponent;
  let fixture: ComponentFixture<MonthlyFeesCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyFeesCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyFeesCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
