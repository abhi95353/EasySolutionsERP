import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MassageTemplateComponent } from './massage-template.component';

describe('MassageTemplateComponent', () => {
  let component: MassageTemplateComponent;
  let fixture: ComponentFixture<MassageTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MassageTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MassageTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
