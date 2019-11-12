import { ChildProperty } from '@syncfusion/ej2-base';
import { SeriesMarkerModel, SeriesMarkerBorderModel } from '../series/series-model';
import { SeriesMarkerDataLabelModel, SeriesMarkerDataLabelBorderModel } from '../series/series-model';
import { SeriesMarkerDataLabelConnectorLineModel } from '../series/series-model';
import { SeriesTooltipBorderModel, SeriesTooltipModel } from '../series/series-model';
import { SmithchartFontModel } from '../utils/utils-model';
export declare class SeriesTooltipBorder extends ChildProperty<SeriesTooltipBorder> {
    /**
     * border width  for tooltip.
    
     */
    width: number;
    /**
     * border color for tooltip
    
     */
    color: string;
}
export declare class SeriesTooltip extends ChildProperty<SeriesTooltip> {
    /**
     * visibility of tooltip.
    
     */
    visible: boolean;
    /**
     * color for tooltip .
    
     */
    fill: string;
    /**
     * opacity for tooltip.
    
     */
    opacity: number;
    /**
     * template for tooltip
   
     */
    template: string;
    /**
     *  options for customizing tooltip border
     */
    border: SeriesTooltipBorderModel;
}
export declare class SeriesMarkerBorder extends ChildProperty<SeriesMarkerBorder> {
    /**
     * border width for marker border.
    
     */
    width: number;
    /**
     * border color for marker border.
    
     */
    color: string;
}
export declare class SeriesMarkerDataLabelBorder extends ChildProperty<SeriesMarkerDataLabelBorder> {
    /**
     * border width for data label border.
    
     */
    width: number;
    /**
     * border color for data label color.
    
     */
    color: string;
}
export declare class SeriesMarkerDataLabelConnectorLine extends ChildProperty<SeriesMarkerDataLabelConnectorLine> {
    /**
     * border width for data label connector line.
    
     */
    width: number;
    /**
     * border color for data label connector line.
    
     */
    color: string;
}
export declare class SeriesMarkerDataLabel extends ChildProperty<SeriesMarkerDataLabel> {
    /**
     * visibility for data label.
    
     */
    visible: boolean;
    /**
     * showing template for data label template
    
     */
    template: string;
    /**
     * color for data label.
    
     */
    fill: string;
    /**
     * opacity for data label.
    
     */
    opacity: number;
    /**
     *  options for customizing data label border
     */
    border: SeriesMarkerDataLabelBorderModel;
    /**
     *  options for customizing data label connector line
     */
    connectorLine: SeriesMarkerDataLabelConnectorLineModel;
    /**
     *  options for customizing font
     */
    textStyle: SmithchartFontModel;
}
export declare class SeriesMarker extends ChildProperty<SeriesMarker> {
    /**
     * visibility for marker.
    
     */
    visible: boolean;
    /**
     * shape for marker.
    
     */
    shape: string;
    /**
     * width for marker.
    
     */
    width: number;
    /**
     * height for marker.
    
     */
    height: number;
    /**
     * Url for the image that is to be displayed as marker
    
     */
    imageUrl: string;
    /**
     * color for marker.
    
     */
    fill: string;
    /**
     * opacity for marker.
    
     */
    opacity: number;
    /**
     *  options for customizing marker border
     */
    border: SeriesMarkerBorderModel;
    /**
     *  options for customizing marker data label
     */
    dataLabel: SeriesMarkerDataLabelModel;
}
export declare class SmithchartSeries extends ChildProperty<SmithchartSeries> {
    /**
     * visibility for series.
    
     */
    visibility: string;
    /**
     * points for series.
    
     */
    points: {
        resistance: number;
        reactance: number;
    }[];
    /**
     * resistance name for dataSource
    
     */
    resistance: string;
    /**
     * reactance name for dataSource
    
     */
    reactance: string;
    /**
     *  Specifies the dataSource
    
    
     */
    dataSource: Object;
    /**
     * The name of the series visible in legend.
    
     */
    name: string;
    /**
     * color for series.
    
     */
    fill: string;
    /**
     * enable or disable the animation of series.
    
     */
    enableAnimation: boolean;
    /**
     * perform animation of series based on animation duration.
    
     */
    animationDuration: string;
    /**
     * avoid the overlap of dataLabels.
    
     */
    enableSmartLabels: boolean;
    /**
     * width for series.
    
     */
    width: number;
    /**
     * opacity for series.
    
     */
    opacity: number;
    /**
     *  options for customizing marker
     */
    marker: SeriesMarkerModel;
    /**
     *  options for customizing tooltip
     */
    tooltip: SeriesTooltipModel;
}
