import { ChildProperty } from '@syncfusion/ej2-base';
/**
 * A class that represents the configuration of working hours related options of scheduler.
 */
export declare class WorkHours extends ChildProperty<WorkHours> {
    /**
     * When set to `true`, highlights the cells of working hour range with an active color.

     */
    highlight: boolean;
    /**
     * It accepts the time string in short skeleton format `Hm` and usually denotes the start of the working hour range.

     */
    start: string;
    /**
     * It accepts the time string in short skeleton format `Hm` and usually denotes the end of the working hour range.

     */
    end: string;
}
