import { PivotCommon } from '../base/pivot-common';
import { TreeView, Tab } from '@syncfusion/ej2-navigations';
import { Dialog } from '@syncfusion/ej2-popups';
import { MaskedTextBox } from '@syncfusion/ej2-inputs';
import { IFilter } from '../../base/engine';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
/**
 * `FilterDialog` module to create filter dialog.
 */
export declare class FilterDialog {
    parent: PivotCommon;
    dropMenu: DropDownButton;
    memberTreeView: TreeView;
    allMemberSelect: TreeView;
    editorSearch: MaskedTextBox;
    dialogPopUp: Dialog;
    tabObj: Tab;
    allowExcelLikeFilter: boolean;
    isSearchEnabled: boolean;
    filterObject: IFilter;
    private timeOutObj;
    /**
     * Constructor for the dialog action.

     */
    constructor(parent?: PivotCommon);
    /**
     * Creates the member filter dialog for the selected field.
     * @method createFilterDialog
     * @return {void}

     */
    createFilterDialog(treeData: {
        [key: string]: Object;
    }[], fieldName: string, fieldCaption: string, target: HTMLElement): void;
    private createTreeView;
    private createLevelWrapper;
    private searchOlapTreeView;
    private nodeCheck;
    private updateChildNodes;
    private updateChildData;
    private createTabMenu;
    private createCustomFilter;
    private createElements;
    private updateInputValues;
    private validateTreeNode;
    /**
     * Update filter state while Member check/uncheck.

     */
    updateCheckedState(fieldCaption?: string): void;
    private getCheckedNodes;
    private getUnCheckedNodes;
    private isExcelFilter;
    private getFilterObject;
    /**
     * To close filter dialog.

     */
    closeFilterDialog(): void;
    private removeFilterDialog;
}
