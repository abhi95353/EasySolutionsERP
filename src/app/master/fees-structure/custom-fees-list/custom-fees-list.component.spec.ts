import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFeesListComponent } from './custom-fees-list.component';

describe('CustomFeesListComponent', () => {
  let component: CustomFeesListComponent;
  let fixture: ComponentFixture<CustomFeesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomFeesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFeesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
