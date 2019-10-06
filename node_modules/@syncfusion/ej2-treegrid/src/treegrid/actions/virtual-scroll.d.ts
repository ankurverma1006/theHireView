import { TreeGrid } from '../base/treegrid';
import { VirtualScroll as GridVirtualScroll, IGrid, ServiceLocator } from '@syncfusion/ej2-grids';
/**
 * TreeGrid Virtual Scroll module will handle Virtualization

 */
export declare class VirtualScroll {
    private parent;
    private expandCollapseRec;
    private prevstartIndex;
    private prevendIndex;
    private visualData;
    /**
     * Constructor for VirtualScroll module
     */
    constructor(parent?: TreeGrid);
    private returnVisualData;
    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string;
    /**

     */
    addEventListener(): void;
    /**

     */
    removeEventListener(): void;
    private collapseExpandVirtualchilds;
    private virtualPageAction;
    /**
     * To destroy the virtualScroll module
     * @return {void}

     */
    destroy(): void;
}
export declare class TreeVirtual extends GridVirtualScroll {
    constructor(parent: IGrid, locator?: ServiceLocator);
    protected instantiateRenderers(): void;
    ensurePageSize(): void;
}
