import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverScrollerComponent } from './cover-scroller.component';

describe('CoverScrollerComponent', () => {
  let component: CoverScrollerComponent;
  let fixture: ComponentFixture<CoverScrollerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoverScrollerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverScrollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
