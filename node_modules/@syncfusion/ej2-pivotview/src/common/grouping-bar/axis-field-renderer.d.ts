import { PivotView } from '../../pivotview/base/pivotview';
/**
 * Module to render Axis Fields
 */
export declare class AxisFields {
    parent: PivotView;
    private pivotButton;
    /** Constructor for render module */
    constructor(parent: PivotView);
    /**
     * Initialize the pivot button rendering
     * @returns void
     * @private
     */
    render(): void;
    private createPivotButtons;
}
