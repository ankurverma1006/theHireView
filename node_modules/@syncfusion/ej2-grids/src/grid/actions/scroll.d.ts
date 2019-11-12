import { IGrid, IAction } from '../base/interface';
/**
 * The `Scroll` module is used to handle scrolling behaviour.
 */
export declare class Scroll implements IAction {
    private parent;
    private lastScrollTop;
    private previousValues;
    private oneTimeReady;
    private content;
    private header;
    private widthService;
    private pageXY;
    /**
     * Constructor for the Grid scrolling.

     */
    constructor(parent?: IGrid);
    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string;
    /**

     */
    setWidth(uiupdate?: boolean): void;
    /**

     */
    setHeight(): void;
    /**

     */
    setPadding(): void;
    /**

     */
    removePadding(rtl?: boolean): void;
    /**
     * Refresh makes the Grid adoptable with the height of parent container.
     *
     * > The [`height`](grid/#height/) must be set to 100%.
     * @return
     */
    refresh(): void;
    private getThreshold;
    /**

     */
    addEventListener(): void;
    /**

     */
    removeEventListener(): void;
    private setScrollLeft;
    private onContentScroll;
    private onFreezeContentScroll;
    private onWheelScroll;
    private onTouchScroll;
    private setPageXY;
    private getPointXY;
    private wireEvents;
    /**

     */
    getCssProperties(rtl?: boolean): ScrollCss;
    private ensureOverflow;
    private onPropertyChanged;
    /**

     */
    destroy(): void;
    /**
     * Function to get the scrollbar width of the browser.
     * @return {number}

     */
    static getScrollBarWidth(): number;
}
/**

 */
export interface ScrollCss {
    padding?: string;
    border?: string;
}
