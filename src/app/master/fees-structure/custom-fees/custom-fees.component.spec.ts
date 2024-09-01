import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFeesComponent } from './custom-fees.component';

describe('CustomFeesComponent', () => {
  let component: CustomFeesComponent;
  let fixture: ComponentFixture<CustomFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomFeesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
