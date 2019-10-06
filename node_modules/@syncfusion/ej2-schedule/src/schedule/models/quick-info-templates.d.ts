import { ChildProperty } from '@syncfusion/ej2-base';
import { TemplateType } from '../base/type';
/**
 * A class that defines the template options available to customize the quick popup of scheduler.
 */
export declare class QuickInfoTemplates extends ChildProperty<QuickInfoTemplates> {
    /**
     * Template option to customize the header section of quick popup.

     */
    templateType: TemplateType;
    /**
     * Template option to customize the header section of quick popup.

     */
    header: string;
    /**
     * Template option to customize the content area of the quick popup.

     */
    content: string;
    /**
     * Template option to customize the footer section of quick popup.

     */
    footer: string;
}
