import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSectionNameComponent } from './manage-section-name.component';

describe('ManageSectionNameComponent', () => {
  let component: ManageSectionNameComponent;
  let fixture: ComponentFixture<ManageSectionNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSectionNameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSectionNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
