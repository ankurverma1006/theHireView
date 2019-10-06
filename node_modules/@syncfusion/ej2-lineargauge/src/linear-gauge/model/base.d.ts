import { ChildProperty } from '@syncfusion/ej2-base';
import { BorderModel, FontModel } from '../model/base-model';
import { Placement, ContainerType } from '../utils/enum';
/**
 * Options for customizing the fonts.
 */
export declare class Font extends ChildProperty<Font> {
    /**
     * Font size for text.
     */
    size: string;
    /**
     * Color for text.
     */
    color: string;
    /**
     * FontFamily for text.
     */
    fontFamily: string;
    /**
     * FontWeight for text.
     */
    fontWeight: string;
    /**
     * FontStyle for text.
     */
    fontStyle: string;
    /**
     * Opacity for text.

     */
    opacity: number;
}
/**
 * Configures the margin of linear gauge.
 */
export declare class Margin extends ChildProperty<Margin> {
    /**
     * Left margin in pixels.

     */
    left: number;
    /**
     * Right margin in pixels.

     */
    right: number;
    /**
     * Top margin in pixels.

     */
    top: number;
    /**
     * Bottom margin in pixels.

     */
    bottom: number;
}
/**
 * Configures the border in linear gauge.
 */
export declare class Border extends ChildProperty<Border> {
    /**
     * The color of the border, which accepts value in hex, rgba as a valid CSS color string.
     */
    color: string;
    /**
     * The width of the border in pixels.

     */
    width: number;
}
/**
 * Options for customizing the annotation.
 */
export declare class Annotation extends ChildProperty<Annotation> {
    /**
     * Specifies the id of html element.
     */
    content: string;
    /**
     * Specifies the position of x.
     */
    x: number;
    /**
     * Specifies the position of y.
     */
    y: number;
    /**
     * Specifies the vertical alignment of annotation.

     */
    verticalAlignment: Placement;
    /**
     * Specifies the horizontal alignment of annotation.

     */
    horizontalAlignment: Placement;
    /**
     * Specifies the zIndex of the annotation.

     */
    zIndex: string;
    /**
     * The font of the axis labels.
     */
    font: FontModel;
    /**
     * Specifies the index of axis.

     */
    axisIndex: number;
    /**
     * Specifies the value of axis.


     */
    axisValue: number;
}
/**
 * Options for customizing the container of linear gauge.
 */
export declare class Container extends ChildProperty<Container> {
    /**
     * Specifies the type of container.

     */
    type: ContainerType;
    /**
     * Specifies the height of the container.

     */
    height: number;
    /**
     * Specifies the width of the container.

     */
    width: number;
    /**
     * Specifies the corner radius for rounded rectangle.

     */
    roundedCornerRadius: number;
    /**
     * Specifies the background of the color.
     */
    backgroundColor: string;
    /**
     * Specifies the border of container.
     */
    border: BorderModel;
    /**
     * Specifies to move the container.

     */
    offset: number;
}
/**
 * Options for customizing the tooltip in linear gauge.
 */
export declare class TooltipSettings extends ChildProperty<TooltipSettings> {
    /**
     * Enable / Disable the visibility of tooltip.

     */
    enable: boolean;
    /**
     * The fill color of the tooltip, which accepts value in hex, rgba as a valid CSS color string.
     */
    fill: string;
    /**
     * Options to customize the tooltip text.
     */
    textStyle: FontModel;
    /**
     * Format of the tooltip content.

     */
    format: string;
    /**
     * Custom template to format the tooltip content. Use ${x} and ${y} as a placeholder text to display the corresponding data point.

     */
    template: string;
    /**
     * If set true, tooltip will animate, while moving from one point to another.

     */
    enableAnimation: boolean;
    /**
     * Options to customize the border for tooltip.
     */
    border: BorderModel;
}
