import { TreeGrid } from '../base';
/**
 * TreeGrid Detail Row module

 */
export declare class DetailRow {
    private parent;
    constructor(parent: TreeGrid);
    /**
  
     */
    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string;
    addEventListener(): void;
    /**
  
     */
    removeEventListener(): void;
    private dataBoundArg;
    private childRowExpand;
    private rowExpandCollapse;
    private detaildataBound;
    private actioncomplete;
    /**
     * Destroys the DetailModule.
     * @method destroy
     * @return {void}
     */
    destroy(): void;
}
