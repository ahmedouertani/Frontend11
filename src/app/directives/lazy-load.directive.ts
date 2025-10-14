// ✅ Directive sans standalone
import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appLazyLoad]',
  standalone:false
})
export class LazyLoadDirective implements OnInit {
  @Input('appLazyLoad') src!: string;

  constructor(private el: ElementRef<HTMLImageElement | HTMLVideoElement>) {}

  ngOnInit() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = this.el.nativeElement;
          if (element instanceof HTMLImageElement) {
            element.src = this.src;
          } else if (element instanceof HTMLVideoElement) {
            element.src = this.src;
          }
          observer.unobserve(element);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(this.el.nativeElement);
  }
} 
