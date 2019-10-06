import { TreeGrid } from '../base';
/**
 * ContextMenu Module for TreeGrid

 */
export declare class ContextMenu {
    private parent;
    constructor(parent: TreeGrid);
    /**

     */
    addEventListener(): void;
    /**

     */
    removeEventListener(): void;
    private contextMenuOpen;
    private contextMenuClick;
    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string;
    /**
     * Destroys the ContextMenu.
     * @method destroy
     * @return {void}
     */
    destroy(): void;
    /**
     * Gets the context menu element from the TreeGrid.
     * @return {Element}
     */
    getContextMenu(): Element;
}
