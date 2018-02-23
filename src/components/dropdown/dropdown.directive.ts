import { Directive, ElementRef, HostBinding } from '@angular/core';

@Directive({
  selector: '[app-dropdown]'
})
export class DropdownDirective {
  observer: MutationObserver;
  constructor(
    public elementRef: ElementRef
  ) { }

}
