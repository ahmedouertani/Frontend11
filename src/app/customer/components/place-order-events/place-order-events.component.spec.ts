import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceOrderEventsComponent } from './place-order-events.component';

describe('PlaceOrderEventsComponent', () => {
  let component: PlaceOrderEventsComponent;
  let fixture: ComponentFixture<PlaceOrderEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlaceOrderEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceOrderEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
