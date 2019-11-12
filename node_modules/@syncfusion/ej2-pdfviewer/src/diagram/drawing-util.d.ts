import { PdfAnnotationBaseModel } from './pdf-annotation-model';
import { DrawingElement, PointModel, BaseAttributes } from '@syncfusion/ej2-drawings';
import { Transforms } from './drawing';
/**

 */
export declare function isLineShapes(obj: PdfAnnotationBaseModel): boolean;
/**

 */
export declare function setElementStype(obj: PdfAnnotationBaseModel, element: DrawingElement): void;
/**

 */
export declare function findPointsLength(points: PointModel[]): number;
/**

 */
export declare function findPerimeterLength(points: PointModel[]): number;
/**   @private  */
export declare function getBaseShapeAttributes(element: DrawingElement, transform?: Transforms): BaseAttributes;
/**
 * Get function
 * @private
 */
export declare function getFunction(value: Function | string): Function;
/** @private */
export declare function cloneObject(obj: any, additionalProp?: Function | string, key?: string): Object;
/** @private */
export declare function cloneArray(sourceArray: Object[], additionalProp?: Function | string, key?: string): Object[];
/** @private */
export declare function getInternalProperties(propName: string): string[];
/**

 */
export declare function isLeader(obj: PdfAnnotationBaseModel, position: string): Leader;
/**

 */
export interface Leader {
    leader: string;
    point: PointModel;
}
