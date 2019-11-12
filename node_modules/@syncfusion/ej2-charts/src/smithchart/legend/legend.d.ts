import { ChildProperty } from '@syncfusion/ej2-base';
import { LegendTitleModel, LegendLocationModel, LegendBorderModel, LegendItemStyleModel } from '../legend/legend-model';
import { SmithchartAlignment } from '../utils/enum';
import { LegendItemStyleBorderModel } from '../legend/legend-model';
import { SmithchartFont } from '../utils/utils';
export declare class LegendTitle extends ChildProperty<LegendTitle> {
    /**
     * visibility for legend title.
    
     */
    visible: boolean;
    /**
     * text for legend title.
    
     */
    text: string;
    /**
     * description for legend title.
    
     */
    description: string;
    /**
     * alignment for legend title.
    
     */
    textAlignment: SmithchartAlignment;
    /**
     *  options for customizing font
     */
    textStyle: SmithchartFont;
}
export declare class LegendLocation extends ChildProperty<LegendLocation> {
    /**
     * x location for legend.
    
     */
    x: number;
    /**
     * y location for legend.
    
     */
    y: number;
}
export declare class LegendItemStyleBorder extends ChildProperty<LegendItemStyleBorder> {
    /**
     * border width for legend item.
    
     */
    width: number;
    /**
     * border color for legend item.
    
     */
    color: string;
}
export declare class LegendItemStyle extends ChildProperty<LegendItemStyle> {
    /**
     * specify the width for legend item.
    
     */
    width: number;
    /**
     * specify the height for legend item.
    
     */
    height: number;
    /**
     *  options for customizing legend item style border
     */
    border: LegendItemStyleBorderModel;
}
export declare class LegendBorder extends ChildProperty<LegendBorder> {
    /**
     * border width for legend.

     */
    width: number;
    /**
     * border color for legend.
    
     */
    color: string;
}
export declare class SmithchartLegendSettings extends ChildProperty<SmithchartLegendSettings> {
    /**
     * visibility for legend.
    
     */
    visible: boolean;
    /**
     * position for legend.
  
     */
    position: string;
    /**
     * alignment for legend.
  
     */
    alignment: SmithchartAlignment;
    /**
     * width for legend.
  
     */
    width: number;
    /**
     * height for legend.
    
     */
    height: number;
    /**
     * shape for legend.
  
     */
    shape: string;
    /**
     * rowCount for legend.
  
     */
    rowCount: number;
    /**
     * columnCount for legend.
  
     */
    columnCount: number;
    /**
     * spacing between legend item.
    
     */
    itemPadding: number;
    /**
     * Padding between the legend shape and text.
    
     */
    shapePadding: number;
    /**
     * description for legend
    
     */
    description: string;
    /**
     * If set to true, series' visibility collapses based on the legend visibility.
    
     */
    toggleVisibility: boolean;
    /**
     *  options for customizing legend title
     */
    title: LegendTitleModel;
    /**
     *  options for customizing legend location
     */
    location: LegendLocationModel;
    /**
     *  options for customizing legend item style
     */
    itemStyle: LegendItemStyleModel;
    /**
     *  options for customizing legend border
     */
    border: LegendBorderModel;
    /**
     *  options for customizing font
     */
    textStyle: SmithchartFont;
}
