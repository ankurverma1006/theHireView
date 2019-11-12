import { PivotCommon } from '../base/pivot-common';
import { Dialog } from '@syncfusion/ej2-popups';
/**
 * `ErrorDialog` module to create error dialog.
 */
export declare class ErrorDialog {
    parent: PivotCommon;
    errorPopUp: Dialog;
    /**
     * Constructor for the dialog action.

     */
    constructor(parent: PivotCommon);
    /**
     * Creates the error dialog for the unexpected action done.
     * @method createErrorDialog
     * @return {void}

     */
    createErrorDialog(title: string, description: string, target?: HTMLElement): void;
    private closeErrorDialog;
    private removeErrorDialog;
}
