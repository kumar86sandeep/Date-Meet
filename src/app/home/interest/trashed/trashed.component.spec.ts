import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashedComponent } from './trashed.component';

describe('TrashedComponent', () => {
  let component: TrashedComponent;
  let fixture: ComponentFixture<TrashedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrashedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrashedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
