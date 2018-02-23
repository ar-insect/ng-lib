import { TreeModel } from './tree.types';
import { size, omit, get } from './util';

export class Tree {

    private _children: Tree[];

    private _expand = true;

    public node: TreeModel;

    public parent: Tree;

    public get children(): Tree[] {
        return this._children;
    }

    private _addChild(child: Tree, position: number = size(this._children) || 0): Tree {
        child.parent = this;

        if (Array.isArray(this._children)) {
            this._children.splice(position, 0, child);
        } else {
            this._children = [child];
        }

        return child;
    }

    private buildTree(model: TreeModel) {
        this.node = omit(model, 'children');
        get(model, 'children', []).forEach((child: TreeModel, index: number) => {
            this._addChild(new Tree(child, this), index);
        });
        // console.log(this.children);
    }

    private _setFoldingType(): void {
        if (!this.isLeaf()) {
            this.node._foldingType = 'node-collapsed';
        } else {
            this.node._foldingType = 'node-leaf';
        }
    }

    public get foldingType(): string {
        if (!this.node._foldingType) {
            this._setFoldingType();
        }
        return this.node._foldingType;
    }

    public isLeaf(): boolean {
        return !Array.isArray(this._children);
    }

    public switchFoldingType() {
        if (this.isLeaf()) {
            return;
        }

        this.node._foldingType = this.isNodeExpanded() ? 'node-collapsed' : 'node-expanded';
    }

    public isNodeExpanded(): boolean {
        return this.foldingType === 'node-expanded';
    }

    constructor(node: TreeModel, parent: Tree = null) {
        this.buildTree(node);
    }
}
