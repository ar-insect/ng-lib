import {
  Component,
  OnChanges,
  SimpleChanges,
  OnInit,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  OnDestroy } from '@angular/core';
import { Tree } from './tree';
import { TreeModel } from './tree.types';


@Component({
  selector: 'app-tree',
  template: `
      <app-tree-internal [tree]="tree"></app-tree-internal>
  `
})
export class TreeComponent implements OnInit, OnChanges, OnDestroy {
  private _treeModel;
  public tree: Tree;

  @Input('tree')
  set treeModel(value: TreeModel) {
    this._treeModel = value;
  }

  get treeModel(): TreeModel {
    return this._treeModel;
  }

  ngOnChanges(changs: SimpleChanges) {
    this.tree = new Tree(this.treeModel);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  constructor(
  ) {
  }

}
