import { ChildProperty } from '@syncfusion/ej2-base';
import { Alignment, TextOverflow, BorderType } from '../utils/enum';
import { FontModel, MultiLevelCategoriesModel, AxisLabelBorderModel } from './base-model';
/**
 * Configures the fonts in heat map.
 */
export declare class Font extends ChildProperty<Font> {
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
     * text alignment

     */
    textAlignment: Alignment;
    /**
     * Specifies the heat map text overflow

     */
    textOverflow: TextOverflow;
}
/**
 * Configures the heat map margins.
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
 * Configures the borders in the heat map.
 */
export declare class Border extends ChildProperty<Border> {
    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.

     */
    color: string;
    /**
     * The width of the border in pixels.

     */
    width: number;
    /**
     * The radius of the border in pixels.

     */
    radius: number;
}
/**
 * Configures the tooltip borders in the heat map.
 */
export declare class TooltipBorder extends ChildProperty<TooltipBorder> {
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
 * Configures the mapping name for size and color in SizeAndColor type.
 */
export declare class BubbleData extends ChildProperty<BubbleData> {
    /**
     * Mapping property to set size.

     */
    size: string;
    /**
     * Mapping property to set color.

     */
    color: string;
}
/**
 * class used to maintain Title styles.
 */
export declare class Title extends ChildProperty<Title> {
    /**
     * Title text

     */
    text: string;
    /**
     * Options for customizing the title.
     */
    textStyle: FontModel;
}
/**
 * class used to maintain palette information.
 */
export declare class PaletteCollection extends ChildProperty<PaletteCollection> {
    /**
     * Palette color value

     */
    value: number;
    /**
     * Palette color text

     */
    color: string;
    /**
     * Palette color label

     */
    label: string;
}
/**
 * label border properties.
 */
export declare class AxisLabelBorder extends ChildProperty<AxisLabelBorder> {
    /**
     * The color of the border that accepts value in hex and rgba as a valid CSS color string.

     */
    color: string;
    /**
     * The width of the border in pixels.

     */
    width: number;
    /**
     * Border type for labels
     * * Rectangle
     * * Without Top Border
     * * Without Top/Bottom Border
     * * Without Border
     * * Without Bottom Border
     * * Brace

     */
    type: BorderType;
}
export declare class BubbleSize extends ChildProperty<BubbleSize> {
    /**
     * Specifies the minimum radius value of the cell in percentage.

     */
    minimum: string;
    /**
     * Specifies the maximum radius value of the cell in percentage.

     */
    maximum: string;
}
/**
 * categories for multi level labels
 */
export declare class MultiLevelCategories extends ChildProperty<MultiLevelCategories> {
    /**
     * Start value of the multi level labels



     */
    start: number | Date | string;
    /**
     * End value of the multi level labels



     */
    end: number | Date | string;
    /**
     * multi level labels text.

     */
    text: string;
    /**
     * Maximum width of the text for multi level labels.



     */
    maximumTextWidth: number;
}
/**
 * MultiLevelLabels properties
 */
export declare class MultiLevelLabels extends ChildProperty<MultiLevelLabels[]> {
    /**
     * Defines the position of the multi level labels. They are,
     * * Near: Places the multi level labels at Near.
     * * Center: Places the multi level labels at Center.
     * * Far: Places the multi level labels at Far.

     */
    alignment: Alignment;
    /**
     * Defines the textOverFlow for multi level labels. They are,
     * * Trim: Trim textOverflow for multi level labels.
     * * Wrap: Wrap textOverflow for multi level labels.
     * * none: None textOverflow for multi level labels.

     */
    overflow: TextOverflow;
    /**
     * Options to customize the multi level labels.
     */
    textStyle: FontModel;
    /**
     * Border of the multi level labels.
     */
    border: AxisLabelBorderModel;
    /**
     * multi level categories for multi level labels.
     */
    categories: MultiLevelCategoriesModel[];
}
/**
 * Internal class used to maintain colorcollection.
 */
export declare class ColorCollection {
    value: number;
    color: string;
    label: string;
    constructor(value: number, color: string, label: string);
}
/**
 * class used to maintain color and value collection.
 */
export declare class BubbleTooltipData {
    mappingName: string;
    bubbleData: number;
    valueType: string;
    constructor(mappingName: string, bubbleData: number, valueType: string);
}
/**
 * Internal class used to maintain legend colorcollection.
 */
export declare class LegendColorCollection {
    value: number;
    color: string;
    label: string;
    isHidden: boolean;
    constructor(value: number, color: string, label: string, isHidden: boolean);
}
