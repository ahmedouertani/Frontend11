import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCoponComponent } from './post-copon.component';

describe('PostCoponComponent', () => {
  let component: PostCoponComponent;
  let fixture: ComponentFixture<PostCoponComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostCoponComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostCoponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
