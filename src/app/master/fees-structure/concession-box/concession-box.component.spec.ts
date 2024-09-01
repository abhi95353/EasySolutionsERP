import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConcessionBoxComponent } from './concession-box.component';

describe('ConcessionBoxComponent', () => {
  let component: ConcessionBoxComponent;
  let fixture: ComponentFixture<ConcessionBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConcessionBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConcessionBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
