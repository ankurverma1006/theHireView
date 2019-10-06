import { IPivotValues, IDataOptions } from './engine';
import { PivotView } from '../pivotview';
import { PivotFieldList } from '../pivotfieldlist';
/**
 * This is a file to perform common utility for OLAP and Relational datasource

 */
export declare class PivotUtil {
    static getType(value: Date): string;
    static resetTime(date: Date): Date;
    static getClonedData(data: {
        [key: string]: Object;
    }[]): {
        [key: string]: Object;
    }[];
    static getClonedPivotValues(pivotValues: IPivotValues): IPivotValues;
    private static getClonedObj;
    static inArray(value: Object, collection: Object[]): number;
    static getClonedDataSourceSettings(dataSourceSettings: IDataOptions): IDataOptions;
    static updateDataSourceSettings(control: PivotView | PivotFieldList, dataSourceSettings: IDataOptions): void;
}
