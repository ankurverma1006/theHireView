import { TreeGrid } from './treegrid';
import { BeforeDataBoundArgs } from '@syncfusion/ej2-grids';
/**
 * Internal dataoperations for tree grid

 */
export declare class DataManipulation {
    private taskIds;
    private parentItems;
    private zerothLevelData;
    private storedIndex;
    private parent;
    private dataResults;
    private sortedData;
    private hierarchyData;
    private isSelfReference;
    private isSortAction;
    constructor(grid: TreeGrid);
    /**

     */
    addEventListener(): void;
    /**

     */
    removeEventListener(): void;
    /**
     * To destroy the dataModule
     * @return {void}

     */
    destroy(): void;
    isRemote(): boolean;
    /**
     * Function to manipulate datasource
    
     */
    convertToFlatData(data: Object): void;
    private selfReferenceUpdate;
    /**
     * Function to update the zeroth level parent records in remote binding
  
     */
    private updateParentRemoteData;
    /**
     * Function to manipulate datasource
  
     */
    private collectExpandingRecs;
    private beginSorting;
    private createRecords;
    /**
     * Function to perform filtering/sorting action for local data
  
     */
    dataProcessor(args?: BeforeDataBoundArgs): void;
    private paging;
    /**
     * update for datasource
     */
    private updateData;
}
