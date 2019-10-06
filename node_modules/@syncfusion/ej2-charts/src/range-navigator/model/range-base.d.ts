import { ChildProperty } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { RangeNavigatorType, ThumbType } from '../utils/enum';
import { BorderModel, AnimationModel, FontModel } from '../../common/model/base-model';
import { ThumbSettingsModel } from './range-base-model';
import { Axis, TooltipDisplayMode } from '../../index';
import { Rect } from '@syncfusion/ej2-svg-base';
import { RangeNavigator, DataPoint } from '../index';
/**
 * Series class for the range navigator
 */
export declare class RangeNavigatorSeries extends ChildProperty<RangeNavigatorSeries> {
    /**
     * It defines the data source for a series.

     */
    dataSource: Object | DataManager;
    /**
     * It defines the xName for the series

     */
    xName: string;
    /**
     * It defines the yName for the series

     */
    yName: string;
    /**
     * It defines the query for the data source

     */
    query: Query;
    /**
     * It defines the series type of the range navigator

     */
    type: RangeNavigatorType;
    /**
     * Options to customizing animation for the series.
     */
    animation: AnimationModel;
    /**
     * Options for customizing the color and width of the series border.
     */
    border: BorderModel;
    /**
     * The fill color for the series that accepts value in hex and rgba as a valid CSS color string.
     * It also represents the color of the signal lines in technical indicators.
     * For technical indicators, the default value is 'blue' and for series, it has null.

     */
    fill: string;
    /**
     * The stroke width for the series that is applicable only for `Line` type series.
     * It also represents the stroke width of the signal lines in technical indicators.

     */
    width: number;
    /**
     * The opacity for the background.

     */
    opacity: number;
    /**
     * Defines the pattern of dashes and gaps to stroke the lines in `Line` type series.

     */
    dashArray: string;
    /** @private */
    seriesElement: Element;
    /** @private */
    clipRectElement: Element;
    /** @private */
    clipRect: Rect;
    /** @private */
    xAxis: Axis;
    /** @private */
    yAxis: Axis;
    /** @private */
    points: DataPoint[];
    /** @private */
    interior: string;
    /** @private */
    index: number;
    /** @private */
    chart: RangeNavigator;
}
/**
 * Thumb settings
 */
export declare class ThumbSettings extends ChildProperty<ThumbSettings> {
    /**
     * width of thumb


     */
    width: number;
    /**
     * height of thumb


     */
    height: number;
    /**
     * border for the thumb
     */
    border: BorderModel;
    /**
     * fill color for the thumb

     */
    fill: string;
    /**
     * type of thumb

     */
    type: ThumbType;
}
/**
 * Style settings
 */
export declare class StyleSettings extends ChildProperty<StyleSettings> {
    /**
     * thumb settings
     */
    thumb: ThumbSettingsModel;
    /**
     * Selected region color

     */
    selectedRegionColor: string;
    /**
     * Un Selected region color

     */
    unselectedRegionColor: string;
}
export declare class RangeTooltipSettings extends ChildProperty<RangeTooltipSettings> {
    /**
     * Enables / Disables the visibility of the tooltip.

     */
    enable: boolean;
    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.

     */
    opacity: number;
    /**
     * The fill color of the tooltip that accepts value in hex and rgba as a valid CSS color string.

     */
    fill: string;
    /**
     * Format the ToolTip content.

     */
    format: string;
    /**
     * Options to customize the ToolTip text.
     */
    textStyle: FontModel;
    /**
     * Custom template to format the ToolTip content. Use ${value} as the placeholder text to display the corresponding data point.

     */
    template: string;
    /**
     * Options to customize tooltip borders.
     */
    border: BorderModel;
    /**
     * It defines display mode for tooltip

     */
    displayMode: TooltipDisplayMode;
}
