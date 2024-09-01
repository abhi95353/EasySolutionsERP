import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFeesStructureComponent } from './create-fees-structure.component';

describe('CreateFeesStructureComponent', () => {
  let component: CreateFeesStructureComponent;
  let fixture: ComponentFixture<CreateFeesStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateFeesStructureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFeesStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
