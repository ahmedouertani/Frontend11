import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEventDetailComponent } from './view-event-detail.component';

describe('ViewEventDetailComponent', () => {
  let component: ViewEventDetailComponent;
  let fixture: ComponentFixture<ViewEventDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewEventDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEventDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
