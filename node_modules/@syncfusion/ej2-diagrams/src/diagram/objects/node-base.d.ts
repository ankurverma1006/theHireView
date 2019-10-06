import { ChildProperty } from '@syncfusion/ej2-base';
import { PointPortModel } from './port-model';
import { MarginModel } from '../core/appearance-model';
import { DiagramTooltipModel } from './tooltip-model';
import { IconShapeModel } from './icon-model';
import { FlipDirection } from '../enum/enum';
/**
 * Defines the common behavior of nodes, connectors and groups
 */
export declare abstract class NodeBase extends ChildProperty<NodeBase> {
    /**
     * Represents the unique id of nodes/connectors

     */
    id: string;
    /**
     * Defines the visual order of the node/connector in DOM

     */
    zIndex: number;
    /**
     * Defines the space to be left between the node and its immediate parent

     */
    margin: MarginModel;
    /**
     * Sets the visibility of the node/connector

     */
    visible: boolean;
    /**
     * Defines the collection of connection points of nodes/connectors



     */
    ports: PointPortModel[];
    /**
     * Defines whether the node is expanded or not

     */
    isExpanded: boolean;
    /**
     * defines the tooltip for the node

     */
    tooltip: DiagramTooltipModel;
    /**
     * Defines the expanded state of a node

     */
    expandIcon: IconShapeModel;
    /**
     * Defines the collapsed state of a node

     */
    collapseIcon: IconShapeModel;
    /**
     * Defines whether the node should be automatically positioned or not. Applicable, if layout option is enabled.

     */
    excludeFromLayout: boolean;
    /**
     * Allows the user to save custom information/data about a node/connector



     */
    addInfo: Object;
    /**
     * Flip the element in Horizontal/Vertical directions



     */
    flip: FlipDirection;
}
