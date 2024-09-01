import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFeeCollectionComponent } from './custom-fee-collection.component';

describe('CustomFeeCollectionComponent', () => {
  let component: CustomFeeCollectionComponent;
  let fixture: ComponentFixture<CustomFeeCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomFeeCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFeeCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
