import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreDueListComponent } from './pre-due-list.component';

describe('PreDueListComponent', () => {
  let component: PreDueListComponent;
  let fixture: ComponentFixture<PreDueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreDueListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreDueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
