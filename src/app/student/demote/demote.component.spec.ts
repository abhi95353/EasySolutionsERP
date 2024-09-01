import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoteComponent } from './demote.component';

describe('DemoteComponent', () => {
  let component: DemoteComponent;
  let fixture: ComponentFixture<DemoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemoteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
