import { OlapEngine } from './engine';
import { IFieldOptions, IDataOptions, IDrillOptions, IDrilledItem } from '../engine';
/**
 * This is a file to create MDX query for the provided OLAP datasource

 */
export declare class MDXQuery {
    private static engine;
    private static rows;
    private static columns;
    private static values;
    private static filters;
    private static calculatedFieldSettings;
    private static valueSortSettings;
    static drilledMembers: IDrillOptions[];
    private static filterMembers;
    private static fieldDataObj;
    private static fieldList;
    private static valueAxis;
    private static cellSetInfo;
    private static isMeasureAvail;
    private static isMondrian;
    private static isPaging;
    private static pageSettings;
    private static allowLabelFilter;
    private static allowValueFilter;
    static getCellSets(dataSourceSettings: IDataOptions, olapEngine: OlapEngine, refPaging?: boolean, drillInfo?: IDrilledItem, isQueryUpdate?: boolean): any;
    private static getTableCellData;
    static frameMDXQuery(rowQuery: string, columnQuery: string, slicerQuery: string, filterQuery: string, caclQuery: string, refPaging?: boolean): string;
    private static getPagingQuery;
    private static getPagingCountQuery;
    static getDimensionsQuery(dimensions: IFieldOptions[], measureQuery: string, axis: string, drillInfo?: IDrilledItem): string;
    private static getDrillQuery;
    private static updateValueSortQuery;
    static getSlicersQuery(slicers: IFieldOptions[], axis: string): string;
    private static getDimensionQuery;
    private static getDimensionUniqueName;
    static getMeasuresQuery(measures: IFieldOptions[]): string;
    private static getfilterQuery;
    private static getAdvancedFilterQuery;
    private static getAdvancedFilterCondtions;
    private static getCalculatedFieldQuery;
}
/**

 */
export interface PagingQuery {
    rowQuery: string;
    columnQuery: string;
}
