import { Gantt } from '../base/gantt';
/**
 * Gantt ColumnMenu module
 *
 */
export declare class ColumnMenu {
    private parent;
    /**
     * Constructor for render module
     */
    constructor(parent?: Gantt);
    getColumnMenu(): HTMLElement;
    destroy(): void;
    /**
     * For internal use only - Get the module name.
     * @private
     */
    private getModuleName;
}
