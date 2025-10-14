import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TansikeventsComponent } from './tansikevents.component';

describe('TansikeventsComponent', () => {
  let component: TansikeventsComponent;
  let fixture: ComponentFixture<TansikeventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TansikeventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TansikeventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
