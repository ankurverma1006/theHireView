/**
 * Sparkline base API Class declarations.
 */
import { ChildProperty } from '@syncfusion/ej2-base';
import { SparklineBorderModel, LineSettingsModel, SparklineFontModel, LabelOffsetModel, TrackLineSettingsModel } from './base-model';
import { VisibleType, EdgeLabelMode } from './enum';
/**
 * Configures the borders in the Sparkline.
 */
export declare class SparklineBorder extends ChildProperty<SparklineBorder> {
    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.
     */
    color: string;
    /**
     * The width of the border in pixels.
     */
    width: number;
}
/**
 * Configures the fonts in sparklines.
 */
export declare class SparklineFont extends ChildProperty<SparklineFont> {
    /**
     * Font size for the text.
     */
    size: string;
    /**
     * Color for the text.
     */
    color: string;
    /**
     * FontFamily for the text.
     */
    fontFamily: string;
    /**
     * FontWeight for the text.
     */
    fontWeight: string;
    /**
     * FontStyle for the text.
     */
    fontStyle: string;
    /**
     * Opacity for the text.

     */
    opacity: number;
}
/**
 * To configure the tracker line settings.
 */
export declare class TrackLineSettings extends ChildProperty<TrackLineSettings> {
    /**
     * Toggle the tracker line visibility.

     */
    visible: boolean;
    /**
     * To config the tracker line color.
     */
    color: string;
    /**
     * To config the tracker line width.

     */
    width: number;
}
/**
 * To configure the tooltip settings for sparkline.
 */
export declare class SparklineTooltipSettings extends ChildProperty<SparklineTooltipSettings> {
    /**
     * Toggle the tooltip visibility.

     */
    visible: boolean;
    /**
     * To customize the tooltip fill color.
     */
    fill: string;
    /**
     * To customize the tooltip template.
     */
    template: string;
    /**
     * To customize the tooltip format.
     */
    format: string;
    /**
     * To configure tooltip border color and width.
     */
    border: SparklineBorderModel;
    /**
     * To configure tooltip text styles.
     */
    textStyle: SparklineFontModel;
    /**
     * To configure the tracker line options.
     */
    trackLineSettings: TrackLineSettingsModel;
}
/**
 * To configure the sparkline container area customization
 */
export declare class ContainerArea extends ChildProperty<ContainerArea> {
    /**
     * To configure Sparkline background color.

     */
    background: string;
    /**
     * To configure Sparkline border color and width.
     */
    border: SparklineBorderModel;
}
/**
 * To configure axis line settings
 */
export declare class LineSettings extends ChildProperty<LineSettings> {
    /**
     * To toggle the axis line visibility.

     */
    visible: boolean;
    /**
     * To configure the sparkline axis line color.
     */
    color: string;
    /**
     * To configure the sparkline axis line dashArray.

     */
    dashArray: string;
    /**
     * To configure the sparkline axis line width.

     */
    width: number;
    /**
     * To configure the sparkline axis line opacity.

     */
    opacity: number;
}
/**
 * To configure the sparkline rangeband
 */
export declare class RangeBandSettings extends ChildProperty<RangeBandSettings> {
    /**
     * To configure sparkline start range

     */
    startRange: number;
    /**
     * To configure sparkline end range

     */
    endRange: number;
    /**
     * To configure sparkline rangeband color
     */
    color: string;
    /**
     * To configure sparkline rangeband opacity

     */
    opacity: number;
}
/**
 * To configure the sparkline axis
 */
export declare class AxisSettings extends ChildProperty<AxisSettings> {
    /**
     * To configure Sparkline x axis min value.


     */
    minX: number;
    /**
     * To configure Sparkline x axis max value.


     */
    maxX: number;
    /**
     * To configure Sparkline y axis min value.


     */
    minY: number;
    /**
     * To configure Sparkline y axis max value.


     */
    maxY: number;
    /**
     * To configure Sparkline horizontal axis line position.


     */
    value: number;
    /**
     * To configure Sparkline axis line settings.
     */
    lineSettings: LineSettingsModel;
}
/**
 * To configure the sparkline padding.
 */
export declare class Padding extends ChildProperty<Padding> {
    /**
     * To configure Sparkline left padding.

     */
    left: number;
    /**
     * To configure Sparkline right padding.

     */
    right: number;
    /**
     * To configure Sparkline bottom padding.

     */
    bottom: number;
    /**
     * To configure Sparkline top padding.

     */
    top: number;
}
/**
 * To configure the sparkline marker options.
 */
export declare class SparklineMarkerSettings extends ChildProperty<SparklineMarkerSettings> {
    /**
     * To toggle the marker visibility.

     */
    visible: VisibleType[];
    /**
     * To configure the marker opacity.

     */
    opacity: number;
    /**
     * To configure the marker size.

     */
    size: number;
    /**
     * To configure the marker fill color.

     */
    fill: string;
    /**
     * To configure Sparkline marker border color and width.
     */
    border: SparklineBorderModel;
}
/**
 * To configure the datalabel offset
 */
export declare class LabelOffset extends ChildProperty<LabelOffset> {
    /**
     * To move the datalabel horizontally.
     */
    x: number;
    /**
     * To move the datalabel vertically.
     */
    y: number;
}
/**
 * To configure the sparkline dataLabel options.
 */
export declare class SparklineDataLabelSettings extends ChildProperty<SparklineDataLabelSettings> {
    /**
     * To toggle the dataLabel visibility.

     */
    visible: VisibleType[];
    /**
     * To configure the dataLabel opacity.

     */
    opacity: number;
    /**
     * To configure the dataLabel fill color.

     */
    fill: string;
    /**
     * To configure the dataLabel format the value.

     */
    format: string;
    /**
     * To configure Sparkline dataLabel border color and width.
     */
    border: SparklineBorderModel;
    /**
     * To configure Sparkline dataLabel text styles.
     */
    textStyle: SparklineFontModel;
    /**
     * To configure Sparkline dataLabel offset.
     */
    offset: LabelOffsetModel;
    /**
     * To change the edge dataLabel placement.

     */
    edgeLabelMode: EdgeLabelMode;
}
