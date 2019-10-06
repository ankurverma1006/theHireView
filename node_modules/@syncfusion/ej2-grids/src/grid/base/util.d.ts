import { IPosition, IGrid, IRow, IExpandedRow } from './interface';
import { ServiceLocator } from '../services/service-locator';
import { Predicate } from '@syncfusion/ej2-data';
import { Column } from '../models/column';
import { Row } from '../models/row';
import { ColumnModel, AggregateColumnModel } from '../models/models';
import { AggregateType, HierarchyGridPrintMode } from './enum';
import { Dialog, Popup } from '@syncfusion/ej2-popups';
import { PredicateModel } from './grid-model';
/**
 * Function to check whether target object implement specific interface
 * @param  {Object} target
 * @param  {string} checkFor
 * @returns no

 */
export declare function doesImplementInterface(target: Object, checkFor: string): boolean;
/**
 * Function to get value from provided data
 * @param  {string} field
 * @param  {Object} data
 * @param  {IColumn} column

 */
export declare function valueAccessor(field: string, data: Object, column: ColumnModel): Object;
/**
 * The function used to update Dom using requestAnimationFrame.
 * @param  {Function} fn - Function that contains the actual action
 * @return {Promise<T>}

 */
export declare function getUpdateUsingRaf<T>(updateFunction: Function, callBack: Function): void;
/**

 */
export declare function updatecloneRow(grid: IGrid): void;
export declare function getCollapsedRowsCount(val: Row<Column>, grid: IGrid): number;
/**

 */
export declare function recursive(row: Object[]): void;
/**

 */
export declare function iterateArrayOrObject<T, U>(collection: U[], predicate: (item: Object, index: number) => T): T[];
export declare function iterateExtend(array: Object[]): Object[];
export declare function templateCompiler(template: string): Function;
export declare function setStyleAndAttributes(node: Element, customAttributes: {
    [x: string]: Object;
}): void;
export declare function extend(copied: Object, first: Object, second?: Object, exclude?: string[]): Object;
export declare function setColumnIndex(columnModel: Column[], ind?: number): number;
export declare function prepareColumns(columns: Column[] | string[] | ColumnModel[], autoWidth?: boolean): Column[];
export declare function setCssInGridPopUp(popUp: HTMLElement, e: MouseEvent | TouchEvent, className: string): void;
export declare function getActualProperties<T>(obj: T): T;
export declare function parentsUntil(elem: Element, selector: string, isID?: boolean): Element;
export declare function getElementIndex(element: Element, elements: Element[]): number;
export declare function inArray(value: Object, collection: Object[]): number;
export declare function getActualPropFromColl(collection: Object[]): Object[];
export declare function removeElement(target: Element, selector: string): void;
export declare function getPosition(e: MouseEvent | TouchEvent): IPosition;
export declare function getUid(prefix: string): string;
export declare function appendChildren(elem: Element | DocumentFragment, children: Element[] | NodeList): Element;
export declare function parents(elem: Element, selector: string, isID?: boolean): Element[];
export declare function calculateAggregate(type: AggregateType | string, data: Object, column?: AggregateColumnModel, context?: Object): Object;
export declare function getScrollBarWidth(): number;
export declare function getRowHeight(element?: HTMLElement): number;
export declare function isComplexField(field: string): boolean;
export declare function getComplexFieldID(field?: string): string;
export declare function setComplexFieldID(field?: string): string;
export declare function isEditable(col: Column, type: string, elem: Element): boolean;
export declare function isActionPrevent(inst: IGrid): boolean;
export declare function wrap(elem: any, action: boolean): void;
export declare function setFormatter(serviceLocator?: ServiceLocator, column?: Column): void;
export declare function addRemoveActiveClasses(cells: Element[], add: boolean, ...args: string[]): void;
export declare function distinctStringValues(result: string[]): string[];
export declare function getFilterMenuPostion(target: Element, dialogObj: Dialog, grid: IGrid): void;
export declare function getZIndexCalcualtion(args: {
    popup: Popup;
}, dialogObj: Dialog): void;
export declare function toogleCheckbox(elem: Element): void;
export declare function createCboxWithWrap(uid: string, elem: Element, className?: string): Element;
export declare function removeAddCboxClasses(elem: Element, checked: boolean): void;
/**
 * Refresh the Row model's foreign data.
 * @param row - Grid Row model object.
 * @param columns - Foreign columns array.
 * @param data - Updated Row data.

 */
export declare function refreshForeignData(row: IRow<Column>, columns: Column[], data: Object): void;
/**
 * Get the foreign data for the corresponding cell value.
 * @param column - Foreign Key column
 * @param data - Row data.
 * @param lValue - cell value.
 * @param foreignData - foreign data source.

 */
export declare function getForeignData(column: Column, data?: Object, lValue?: string | number, foreignKeyData?: Object[]): Object[];
/**
 * To use to get the column's object by the foreign key value.
 * @param foreignKeyValue - Defines ForeignKeyValue.
 * @param columns - Array of column object.

 */
export declare function getColumnByForeignKeyValue(foreignKeyValue: string, columns: Column[]): Column;
/**

 * @param filterObject - Defines predicate model object
 */
export declare function getDatePredicate(filterObject: PredicateModel, type?: string): Predicate;
/**

 */
export declare function renderMovable(ele: Element, frzCols: number): Element;
/**

 */
export declare function isGroupAdaptive(grid: IGrid): boolean;
/**

 */
export declare function getObject(field?: string, object?: Object): any;
/**

 */
export declare function getCustomDateFormat(format: string | Object, colType: string): string;
/**

 */
export declare function getExpandedState(gObj: IGrid, hierarchyPrintMode: HierarchyGridPrintMode): {
    [index: number]: IExpandedRow;
};
/**

 */
export declare function getPrintGridModel(gObj: IGrid, hierarchyPrintMode?: HierarchyGridPrintMode): IGrid;
/**

 */
export declare function extendObjWithFn(copied: Object, first: Object, second?: Object, deep?: boolean): Object;
/**

 */
export declare function measureColumnDepth(column: Column[]): number;
/**

 */
export declare function checkDepth(col: Column, index: number): number;
/**

 */
export declare function refreshFilteredColsUid(gObj: IGrid, filteredCols: PredicateModel[]): void;
export declare namespace Global {
    let timer: Object;
}
