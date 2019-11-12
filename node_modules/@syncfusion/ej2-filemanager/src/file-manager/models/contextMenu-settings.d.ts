import { ChildProperty } from '@syncfusion/ej2-base';
export declare const fileItems: string[];
export declare const folderItems: string[];
export declare const layoutItems: string[];
/**
 * Specifies the ContextMenu settings of the File Manager.
 */
export declare class ContextMenuSettings extends ChildProperty<ContextMenuSettings> {
    /**
     * Specifies the array of string or object that is used to configure file items.

     */
    file: string[];
    /**
     * An array of string or object that is used to configure folder items.

     */
    folder: string[];
    /**
     * An array of string or object that is used to configure layout items.

     */
    layout: string[];
    /**
     * Enables or disables the ContextMenu.

     */
    visible: boolean;
}
