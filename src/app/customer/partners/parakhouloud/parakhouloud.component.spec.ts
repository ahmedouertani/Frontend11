import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParakhouloudComponent } from './parakhouloud.component';

describe('ParakhouloudComponent', () => {
  let component: ParakhouloudComponent;
  let fixture: ComponentFixture<ParakhouloudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParakhouloudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParakhouloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
