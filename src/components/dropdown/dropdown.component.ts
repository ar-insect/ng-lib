import { CdkConnectedOverlay, ConnectedOverlayPositionChange, ConnectionPositionPair } from '@angular/cdk/overlay';
import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ContentChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Renderer2,
  QueryList,
  ViewEncapsulation,
  Inject} from '@angular/core';
import { Observable, Subscribable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { merge } from 'rxjs/operators/merge';
import { mapTo } from 'rxjs/operators/mapTo';
import { debounceTime } from 'rxjs/operators/debounceTime';

import { DropdownDirective } from './dropdown.directive';

@Component({
  selector: 'app-dropdown',
  encapsulation  : ViewEncapsulation.None,
  template: `
    <div>
      <ng-content></ng-content>
    </div>
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayHasBackdrop]="_hasBackdrop"
      [cdkConnectedOverlayOrigin]="_origin"
      [cdkConnectedOverlayMinWidth]="_triggerWidth"
      [cdkConnectedOverlayOpen]="wzVisible"
      (backdropClick)="_hide()">
      <div class="wz-drop-down"
        [style.minWidth.px]="_triggerWidth"
        (mouseenter)="_onMouseEnterEvent($event)"
        (mouseleave)="_onMouseLeaveEvent($event)"
        (click)="_clickDropDown($event)">
        <ng-content select="[dropdown-custom]"></ng-content>
      </div>
    </ng-template>
  `,
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit, OnDestroy, AfterViewInit {
  private _visible = false;
  private  _clickHide = false;
  private _triggerWidth = 0;
  private _subscription: Subscription;
  private get _hasBackdrop(): boolean {
    return this.wzTrigger === 'click';
  }

  @Input()
  public wzTrigger: 'click' | 'hover' = 'hover'; // 默认是`hover`

  public set wzVisible(value: boolean) {
    this._visible = value;
  }

  public get wzVisible(): boolean {
    return this._visible;
  }

  public set wzClickHide(value: boolean) {
    this._clickHide = value;
  }

  public get wzClickHide(): boolean {
    return this._clickHide;
  }

  @ContentChild(DropdownDirective) _origin;
  @Output() _visibleChange = new Subject<boolean>();
  @ViewChild(CdkConnectedOverlay) _cdkOverlay: CdkConnectedOverlay;
  _onMouseEnterEvent(e: MouseEvent): void {
    if (this.wzTrigger === 'hover') {
      this._show();
    }
  }

  _onMouseLeaveEvent(e: MouseEvent): void {
    if (this.wzTrigger === 'hover') {
      this._hide();
    }
  }

  _hide(): void {
    this._visibleChange.next(false);
  }

  _show(): void {
    this._visibleChange.next(true);
  }

  _clickDropDown($event: MouseEvent) {
    $event.stopPropagation();
    if (this.wzClickHide) {
      this._hide();
    }
  }

  _setTriggerWidth() {
    this._triggerWidth = this._origin.elementRef.nativeElement.getBoundingClientRect().width;
    /** should remove after https://github.com/angular/material2/pull/8765 merged **/
    if (this._cdkOverlay && this._cdkOverlay.overlayRef) {
      this._cdkOverlay.overlayRef.updateSize({
        minWidth: this._triggerWidth
      });
    }
  }

  // callback
  _onVisibleChange = (visible: boolean) => {
    // console.log(visible);
    if (visible) {
      this._setTriggerWidth();
    }
    if (this.wzVisible !== visible) {
      this.wzVisible = visible;
    }
    this._changeDetector.markForCheck();
  }

  _startSubscribe(observable: Observable<boolean>): void {
    this._subscription = observable.pipe(debounceTime(50))
      .subscribe(this._onVisibleChange);
  }

  ngOnInit() {
    console.log(this._origin.elementRef.nativeElement);
  }

  ngAfterViewInit(): void {
    let mouse: Observable<boolean>;
    if (this.wzTrigger === 'hover') {
      const mouseEneterOrigin = fromEvent(this._origin.elementRef.nativeElement, 'mouseenter').pipe(mapTo(true));
      const mouseLeaveOrigin = fromEvent(this._origin.elementRef.nativeElement, 'mouseleave').pipe(mapTo(false));
      mouse = mouseEneterOrigin.pipe(merge(mouseLeaveOrigin));
    }
    if (this.wzTrigger === 'click') {
      mouse = fromEvent(this._origin.elementRef.nativeElement, 'click').pipe(mapTo(true));
      this._renderer.listen(this._origin.elementRef.nativeElement, 'click', (e) => {
        e.preventDefault();
      });
    }
    const observable = mouse.pipe(merge(this._visibleChange));
    this._startSubscribe(observable);
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  constructor(
    private _renderer: Renderer2,
    protected _changeDetector: ChangeDetectorRef
  ) { }
}
