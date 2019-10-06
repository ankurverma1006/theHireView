import { Chart } from '../chart';
import { ChartData } from '../../chart/utils/get-data';
/**
 * Marker Module used to render the marker for line type series.
 */
export declare class MarkerExplode extends ChartData {
    private markerExplode;
    private isRemove;
    /** @private */
    elementId: string;
    /**
     * Constructor for the marker module.
     * @private
     */
    constructor(chart: Chart);
    /**

     */
    addEventListener(): void;
    /**

     */
    removeEventListener(): void;
    /**

     */
    private mouseUpHandler;
    /**

     */
    private mouseMoveHandler;
    private markerMove;
    private drawTrackBall;
    /**

     */
    removeHighlightedMarker(): void;
}
