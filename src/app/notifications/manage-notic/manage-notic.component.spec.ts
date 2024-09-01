import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageNoticComponent } from './manage-notic.component';

describe('ManageNoticComponent', () => {
  let component: ManageNoticComponent;
  let fixture: ComponentFixture<ManageNoticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageNoticComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageNoticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
