import { PivotView } from '../../pivotview/base/pivotview';
import { IAction } from '../../common/base/interface';
/**
 * Module for PivotCommon rendering
 */
export declare class Common implements IAction {
    /**
     * Module declarations
     */
    private parent;
    private handlers;
    /** Constructor for Common module */
    constructor(parent: PivotView);
    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string;
    private initiateCommonModule;
    /**

     */
    addEventListener(): void;
    /**

     */
    removeEventListener(): void;
    /**
     * To destroy the groupingbar
     * @return {void}

     */
    destroy(): void;
}
