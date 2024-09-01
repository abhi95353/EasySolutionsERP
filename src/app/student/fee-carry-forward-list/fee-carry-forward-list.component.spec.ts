import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeCarryForwardListComponent } from './fee-carry-forward-list.component';

describe('FeeCarryForwardListComponent', () => {
  let component: FeeCarryForwardListComponent;
  let fixture: ComponentFixture<FeeCarryForwardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeCarryForwardListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeCarryForwardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
