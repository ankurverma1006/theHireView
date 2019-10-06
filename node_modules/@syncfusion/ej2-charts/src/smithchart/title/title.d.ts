import { ChildProperty } from '@syncfusion/ej2-base';
import { SmithchartFontModel } from '../utils/utils-model';
import { SmithchartAlignment } from '../utils/enum';
import { SubtitleModel } from '../title/title-model';
export declare class Subtitle extends ChildProperty<Subtitle> {
    /**
     * visibility for sub title.
    
     */
    visible: boolean;
    /**
     * text for sub title.
    
     */
    text: string;
    /**
     * description for sub title.
    
     */
    description: string;
    /**
     * text alignment for sub title.
    
     */
    textAlignment: SmithchartAlignment;
    /**
     * trim the sub title.
   
     */
    enableTrim: boolean;
    /**
     * maximum width of the sub title.
    
    
     */
    maximumWidth: number;
    /**
     * options for customizing sub title font
     */
    textStyle: SmithchartFontModel;
}
export declare class Title extends ChildProperty<Title> {
    /**
     * visibility for title.
    
     */
    visible: boolean;
    /**
     * text for title.
    
     */
    text: string;
    /**
     * description for title.
    
     */
    description: string;
    /**
     * text alignment for title.
    
     */
    textAlignment: SmithchartAlignment;
    /**
     * trim the title.
    
     */
    enableTrim: boolean;
    /**
     * maximum width of the sub title
    
    
     */
    maximumWidth: number;
    /**
     * options for customizing sub title
     */
    subtitle: SubtitleModel;
    /**
     * options for customizing title font
     */
    font: SmithchartFontModel;
    /**
     * options for customizing title text
     */
    textStyle: SmithchartFontModel;
}
