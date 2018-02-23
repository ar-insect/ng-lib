import { Directive, HostBinding, Input, ElementRef, HostListener } from '@angular/core';
import { Tree } from './tree';
import { TreeInternalComponent } from './tree-internal.component';

@Directive({
  selector: '[appTreeNode]',
  host: {
    '[class.tree-node]': 'true',
    '[class.tree-node-icon]': 'true'
  }
})
export class TreeNodeDirective {
  private _expand: boolean;
  private _collapsed: boolean;
  private tree: Tree;

  @HostBinding(`class.tree-node-expand`)
  set expand(value: boolean) {
    this._expand = value;
  }

  get expand(): boolean {
    return this._expand;
  }

  @HostBinding(`class.tree-node-collapsed`)
  set collapsed(value: boolean) {
    this._collapsed = value;
  }

  get collapsed(): boolean {
    return this._collapsed;
  }
  @HostListener('click', ['$event'])
  onClick($event: Event) {
    $event.stopPropagation();
    this.tree.switchFoldingType();
    // console.log(this.tree.isNodeExpanded());
    this.expand = this.tree.isNodeExpanded();
    this.collapsed = !this.tree.isNodeExpanded();
  }

  constructor(
    public component: TreeInternalComponent,
    public _elementRef: ElementRef
  ) {
    this.tree = this.component.tree;
  }

}
