import { TreeGrid } from '../base/treegrid';
import { ColumnModel, Column } from '../models';
/**
 * TreeGrid Reorder module

 */
export declare class Reorder {
    private parent;
    /**
     * Constructor for Reorder module
     */
    constructor(parent?: TreeGrid, treeColumn?: Column | string | ColumnModel);
    /**
     * For internal use only - Get the module name.
     * @private
     */
    private getModuleName;
    /**

     */
    addEventListener(): void;
    removeEventListener(): void;
    /**
     * To destroy the Reorder
     * @return {void}

     */
    destroy(): void;
    private getTreeColumn;
}
