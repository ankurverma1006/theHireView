import { ChildProperty } from '@syncfusion/ej2-base';
import { IElement, ThumbsConstraints } from '@syncfusion/ej2-drawings';
import { Container } from '@syncfusion/ej2-drawings';
import { PointModel } from '@syncfusion/ej2-drawings';
import { PdfAnnotationBaseModel } from './pdf-annotation-model';
/**
 * Defines the size and position of selected items and defines the appearance of selector

 */
export declare class Selector extends ChildProperty<Selector> implements IElement {
    /**
     * Defines the size and position of the container

     */
    wrapper: Container;
    /**
     * Defines the collection of selected nodes
     */
    annotations: PdfAnnotationBaseModel[];
    /**
     * Sets/Gets the width of the container


     */
    width: number;
    /**
     * Sets/Gets the height of the container


     */
    height: number;
    /**
     * Sets the rotate angle of the container

     */
    rotateAngle: number;
    /**
     * Sets the positionX of the container

     */
    offsetX: number;
    /**
     * Sets the positionY of the container

     */
    offsetY: number;
    /**
     * Sets the pivot of the selector

     */
    pivot: PointModel;
    /**
     * set the constraint of the container
     * * Rotate - Enable Rotate Thumb
     * * ConnectorSource - Enable Connector source point
     * * ConnectorTarget - Enable Connector target point
     * * ResizeNorthEast - Enable ResizeNorthEast Resize
     * * ResizeEast - Enable ResizeEast Resize
     * * ResizeSouthEast - Enable ResizeSouthEast Resize
     * * ResizeSouth - Enable ResizeSouth Resize
     * * ResizeSouthWest - Enable ResizeSouthWest Resize
     * * ResizeWest - Enable ResizeWest Resize
     * * ResizeNorthWest - Enable ResizeNorthWest Resize
     * * ResizeNorth - Enable ResizeNorth Resize
     * @private

     */
    thumbsConstraints: ThumbsConstraints;
    /**
     * Initializes the UI of the container
     */
    init(diagram: any): Container;
}
