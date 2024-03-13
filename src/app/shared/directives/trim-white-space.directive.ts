import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appTrimWhitespace]'
})
export class TrimWhiteSpaceDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    let trimmedValue = value.trim();
    if (trimmedValue.length !== 0) {
      trimmedValue = value;
    }
    this.renderer.setProperty(this.el.nativeElement, 'value', trimmedValue);
  }
}
