import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TansikProdComponent } from './tansik-prod.component';

describe('TansikProdComponent', () => {
  let component: TansikProdComponent;
  let fixture: ComponentFixture<TansikProdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TansikProdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TansikProdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
