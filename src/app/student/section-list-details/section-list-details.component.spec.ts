import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionListDetailsComponent } from './section-list-details.component';

describe('SectionListDetailsComponent', () => {
  let component: SectionListDetailsComponent;
  let fixture: ComponentFixture<SectionListDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionListDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionListDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
