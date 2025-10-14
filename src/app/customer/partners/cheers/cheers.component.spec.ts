import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheersComponent } from './cheers.component';

describe('CheersComponent', () => {
  let component: CheersComponent;
  let fixture: ComponentFixture<CheersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
