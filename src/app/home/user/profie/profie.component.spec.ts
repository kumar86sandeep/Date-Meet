import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfieComponent } from './profie.component';

describe('ProfieComponent', () => {
  let component: ProfieComponent;
  let fixture: ComponentFixture<ProfieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
