import { PivotView } from '../base/pivotview';
import { DrillThroughDialog } from '../../common/popups/drillthrough-dialog';
/**
 * `DrillThrough` module.
 */
export declare class DrillThrough {
    private parent;
    /**

     */
    drillThroughDialog: DrillThroughDialog;
    /**
     * Constructor.

     */
    constructor(parent?: PivotView);
    /**
     * It returns the Module name.
     * @returns string

     */
    getModuleName(): string;
    private addInternalEvents;
    private wireEvents;
    private unWireEvents;
    private mouseClickHandler;
    private executeDrillThrough;
}
