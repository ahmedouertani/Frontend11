import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TansikprodComponent } from './tansikprod.component';

describe('TansikprodComponent', () => {
  let component: TansikprodComponent;
  let fixture: ComponentFixture<TansikprodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TansikprodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TansikprodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
