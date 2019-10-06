import { TreeGrid, ColumnMenu as TreeGridColumnMenu } from '@syncfusion/ej2-treegrid';
/**
 * Gantt ColumnMenu module
 *
 */
var ColumnMenu = /** @class */ (function () {
    /**
     * Constructor for render module
     */
    function ColumnMenu(parent) {
        TreeGrid.Inject(TreeGridColumnMenu);
        this.parent = parent;
    }
    ColumnMenu.prototype.getColumnMenu = function () {
        return this.parent.treeGrid.columnMenuModule.getColumnMenu();
    };
    ColumnMenu.prototype.destroy = function () {
        // column menu destroy module
    };
    /**
     * For internal use only - Get the module name.
     * @private
     */
    ColumnMenu.prototype.getModuleName = function () {
        return 'columnMenu';
    };
    return ColumnMenu;
}());
export { ColumnMenu };
