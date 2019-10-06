import { ChildProperty } from '@syncfusion/ej2-base';
import { TooltipModel } from '@syncfusion/ej2-popups';
/**
 * Configures the popup settings of the In-place editor.
 */
export declare class PopupSettings extends ChildProperty<PopupSettings> {
    /**
     * Specifies title for the editor popup.

     */
    title: string;
    /**
     * Specifies model for editor popup customization like position, animation,etc.

     */
    model: TooltipModel;
}
/**

 */
export declare let modulesList: {
    [key: string]: string;
};
/**

 */
export declare let localeConstant: {
    [key: string]: object;
};
