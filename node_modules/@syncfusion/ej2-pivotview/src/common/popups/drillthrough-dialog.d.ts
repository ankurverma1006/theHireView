import { Dialog } from '@syncfusion/ej2-popups';
import { PivotView } from '../../pivotview';
import { DrillThroughEventArgs } from '../base/interface';
import { Grid } from '@syncfusion/ej2-grids';
/**
 * `DrillThroughDialog` module to create drill-through dialog.
 */
export declare class DrillThroughDialog {
    parent: PivotView;
    dialogPopUp: Dialog;
    drillThroughGrid: Grid;
    private isUpdated;
    private gridIndexObjects;
    private engine;
    private gridData;
    /**
     * Constructor for the dialog action.

     */
    constructor(parent?: PivotView);
    showDrillThroughDialog(eventArgs: DrillThroughEventArgs): void;
    private removeDrillThroughDialog;
    private createDrillThroughGrid;
    private frameGridColumns;
    private formatData;
    private dataWithPrimarykey;
}
