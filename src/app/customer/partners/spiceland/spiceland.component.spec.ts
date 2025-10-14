import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpicelandComponent } from './spiceland.component';

describe('SpicelandComponent', () => {
  let component: SpicelandComponent;
  let fixture: ComponentFixture<SpicelandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpicelandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpicelandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
