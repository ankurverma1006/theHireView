import { ChildProperty } from '@syncfusion/ej2-base';
import { SortDirection } from '@syncfusion/ej2-grids';
import { SortDescriptorModel } from './sort-settings-model';
/**
 * Represents the field name and direction of sort column.
 */
export declare class SortDescriptor extends ChildProperty<SortDescriptor> {
    /**
     * Defines the field name of sort column.

     */
    field: string;
    /**
     * Defines the direction of sort column.





     */
    direction: SortDirection;
}
/**
 * Configures the sorting behavior of TreeGrid.
 */
export declare class SortSettings extends ChildProperty<SortSettings> {
    /**
     * Specifies the columns to sort at initial rendering of TreeGrid.
     * Also user can get current sorted columns.

     */
    columns: SortDescriptorModel[];
    /**
     * If `allowUnsort` set to false the user can not get the TreeGrid in unsorted state by clicking the sorted column header.

     */
    allowUnsort: boolean;
}
