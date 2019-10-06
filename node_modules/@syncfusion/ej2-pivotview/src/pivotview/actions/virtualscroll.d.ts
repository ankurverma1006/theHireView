import { PivotView } from '../base/pivotview';
/**
 * `VirtualScroll` module is used to handle scrolling behavior.
 */
export declare class VirtualScroll {
    private parent;
    private previousValues;
    private frozenPreviousValues;
    private pageXY;
    private eventType;
    private engineModule;
    direction: string;
    /**
     * Constructor for PivotView scrolling.

     */
    constructor(parent?: PivotView);
    /**
     * It returns the Module name.
     * @returns string

     */
    getModuleName(): string;
    private addInternalEvents;
    private wireEvents;
    private onWheelScroll;
    private getPointXY;
    private onTouchScroll;
    private update;
    private setPageXY;
    private common;
    private onHorizondalScroll;
    private onVerticalScroll;
    /**

     */
    removeInternalEvents(): void;
    /**
     * To destroy the virtualscrolling event listener
     * @return {void}

     */
    destroy(): void;
}
