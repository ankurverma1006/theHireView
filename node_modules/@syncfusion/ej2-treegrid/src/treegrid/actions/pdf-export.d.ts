import { TreeGrid } from '../base/treegrid';
import { PdfExportProperties } from '@syncfusion/ej2-grids';
import { Ajax } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
/**
 * TreeGrid PDF Export module

 */
export declare class PdfExport {
    private parent;
    private dataResults;
    /**
     * Constructor for PDF export module
     */
    constructor(parent?: TreeGrid);
    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string;
    /**

     */
    addEventListener(): void;
    /**

     */
    removeEventListener(): void;
    /**
     * To destroy the PDF Export
     * @return {void}

     */
    destroy(): void;
    private updatePdfResultModel;
    Map(pdfExportProperties?: PdfExportProperties, isMultipleExport?: boolean, pdfDoc?: Object, isBlob?: boolean): Promise<Object>;
    protected generateQuery(query: Query, prop?: PdfExportProperties): Query;
    protected manipulatePdfProperties(prop?: PdfExportProperties, dtSrc?: Object, queryResult?: Ajax): Object;
    /**
     * TreeGrid PDF Export cell modifier

     */
    private pdfQueryCellInfo;
}
