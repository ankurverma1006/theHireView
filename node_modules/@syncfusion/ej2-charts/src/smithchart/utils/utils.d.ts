import { ChildProperty } from '@syncfusion/ej2-base';
import { SmithchartFontModel } from './utils-model';
export declare class SmithchartFont extends ChildProperty<SmithchartFont> {
    /**
     * font family for text.
     */
    fontFamily: string;
    /**
     * font style for text.

     */
    fontStyle: string;
    /**
     * font weight for text.

     */
    fontWeight: string;
    /**
     * Color for the text.

     */
    color: string;
    /**
     * font size for text.

     */
    size: string;
    /**
     * font opacity for text.

     */
    opacity: number;
}
export declare class SmithchartMargin extends ChildProperty<SmithchartMargin> {
    /**
     * top margin of chartArea.

     */
    top: number;
    /**
     * bottom margin of chartArea.

     */
    bottom: number;
    /**
     * right margin of chartArea.

     */
    right: number;
    /**
     * left margin of chartArea.

     */
    left: number;
}
export declare class SmithchartBorder extends ChildProperty<SmithchartBorder> {
    /**
     * width for smithchart border.

     */
    width: number;
    /**
     * opacity for smithchart border.

     */
    opacity: number;
    /**
     * color for smithchart border .

     */
    color: string;
}
/**
 * Internal use of type rect
 */
export declare class SmithchartRect {
    /** x value for rect */
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x: number, y: number, width: number, height: number);
}
export declare class LabelCollection {
    centerX: number;
    centerY: number;
    radius: number;
    value: number;
}
export declare class LegendSeries {
    text: string;
    seriesIndex: number;
    shape: string;
    fill: string;
    bounds: SmithchartSize;
}
export declare class LabelRegion {
    bounds: SmithchartRect;
    labelText: string;
}
export declare class HorizontalLabelCollection extends LabelCollection {
    region: LabelRegion;
}
export declare class RadialLabelCollections extends HorizontalLabelCollection {
    angle: number;
}
export declare class LineSegment {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
}
export declare class PointRegion {
    point: Point;
    x: number;
    y: number;
}
/**
 * Smithchart internal class for point
 */
export declare class Point {
    x: number;
    y: number;
}
export declare class ClosestPoint {
    location: Point;
    index: number;
}
export declare class MarkerOptions {
    id: string;
    fill: string;
    opacity: number;
    borderColor: string;
    borderWidth: number;
    constructor(id?: string, fill?: string, borderColor?: string, borderWidth?: number, opacity?: number);
}
export declare class SmithchartLabelPosition {
    textX: number;
    textY: number;
    x: number;
    y: number;
}
export declare class Direction {
    counterclockwise: number;
    clockwise: number;
}
export declare class DataLabelTextOptions {
    id: string;
    x: number;
    y: number;
    text: string;
    fill: string;
    font: SmithchartFontModel;
    xPosition: number;
    yPosition: number;
    width: number;
    height: number;
    location: Point;
    labelOptions: SmithchartLabelPosition;
    visible: boolean;
    connectorFlag: boolean;
}
export declare class LabelOption {
    textOptions: DataLabelTextOptions[];
}
/** @private */
export declare class SmithchartSize {
    height: number;
    width: number;
    constructor(width: number, height: number);
}
export declare class GridArcPoints {
    startPoint: Point;
    endPoint: Point;
    rotationAngle: number;
    sweepDirection: number;
    isLargeArc: boolean;
    size: SmithchartSize;
}
