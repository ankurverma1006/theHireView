import { PivotView } from '../base/pivotview';
/**

 * `ExcelExport` module is used to handle the Excel export action.
 */
export declare class ExcelExport {
    private parent;
    private engine;
    /**
     * Constructor for the PivotGrid Excel Export module.

     */
    constructor(parent?: PivotView);
    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string;
    /**
     * Method to perform excel export.

     */
    exportToExcel(type: string): void;
    /**
     * To destroy the excel export module
     * @returns void

     */
    destroy(): void;
}
