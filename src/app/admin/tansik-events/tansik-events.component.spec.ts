import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TansikEventsComponent } from './tansik-events.component';

describe('TansikEventsComponent', () => {
  let component: TansikEventsComponent;
  let fixture: ComponentFixture<TansikEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TansikEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TansikEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
