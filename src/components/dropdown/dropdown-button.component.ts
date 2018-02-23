import {
  Component,
  OnInit,
  ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-dropdown-button',
  encapsulation  : ViewEncapsulation.None,
  template: `
    <div>dropdown-button</div>
  `
})
export class DropdownButtonComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
