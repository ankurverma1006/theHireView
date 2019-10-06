import { TreeGrid } from '../base/treegrid';
/**
 * TreeGrid Print module

 */
export declare class Print {
    private parent;
    /**
     * Constructor for Print module
     */
    constructor(parent?: TreeGrid);
    /**
     * For internal use only - Get the module name.
     * @private
     */
    private getModuleName;
    /**

     */
    addEventListener(): void;
    removeEventListener(): void;
    private printTreeGrid;
    print(): void;
    /**
     * To destroy the Print
     * @return {void}

     */
    destroy(): void;
}
