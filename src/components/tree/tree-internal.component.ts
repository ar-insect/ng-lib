import {
    Component,
    OnInit,
    ViewEncapsulation,
    Input,
    Output,
    EventEmitter,
    OnDestroy } from '@angular/core';
  import { Tree } from './tree';

  interface TreeConfig {
    id: number;
    ptext: string;
    children?: Array<TreeConfig>;
  }

  @Component({
    selector: 'app-tree-internal',
    encapsulation: ViewEncapsulation.None,
    template: `
        <ul class="tree" *ngIf="tree">
          <li>
          <div>
            <span *ngIf="!tree.isLeaf()" appTreeNode> + </span>
            <span appTreeNodeValue>{{ tree.node.ptext || "root" }}</span>
          </div>
          <ng-template [ngIf]="tree.isNodeExpanded()">
            <app-tree-internal *ngFor="let child of tree.children" [tree]="child"></app-tree-internal>
          </ng-template>
          </li>
        </ul>
    `,
    styleUrls: ['./tree.component.scss']
  })
  export class TreeInternalComponent implements OnInit, OnDestroy {

    @Input()
    tree: Tree;

    constructor(
    ) {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
    }

}
