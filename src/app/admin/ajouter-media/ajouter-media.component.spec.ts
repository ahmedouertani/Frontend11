import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterMediaComponent } from './ajouter-media.component';

describe('AjouterMediaComponent', () => {
  let component: AjouterMediaComponent;
  let fixture: ComponentFixture<AjouterMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AjouterMediaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
