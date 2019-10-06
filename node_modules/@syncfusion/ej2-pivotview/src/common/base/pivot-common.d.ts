import { Internationalization, L10n } from '@syncfusion/ej2-base';
import { IDataOptions, PivotEngine } from '../../base/engine';
import { CommonArgs } from './interface';
import { Mode } from '../base/enum';
import { CommonKeyboardInteraction } from '../actions/keyboard';
import { EventBase } from '../actions/event-base';
import { NodeStateModified } from '../actions/node-state-modified';
import { DataSourceUpdate } from '../actions/dataSource-update';
import { ErrorDialog } from '../popups/error-dialog';
import { FilterDialog } from '../popups/filter-dialog';
import { PivotView } from '../../pivotview';
import { PivotFieldList } from '../../pivotfieldlist';
import { OlapEngine } from '../../base/olap/engine';
/**
 * PivotCommon is used to manipulate the relational or Multi-Dimensional public methods by using their dataSource

 */
export declare class PivotCommon {
    globalize: Internationalization;
    localeObj: L10n;
    engineModule: PivotEngine | OlapEngine;
    dataSourceSettings: IDataOptions;
    element: HTMLElement;
    moduleName: string;
    enableRtl: boolean;
    isAdaptive: boolean;
    renderMode: Mode;
    parentID: string;
    control: PivotView | PivotFieldList;
    currentTreeItems: {
        [key: string]: Object;
    }[];
    savedTreeFilterPos: {
        [key: number]: string;
    };
    currentTreeItemsPos: {
        [key: string]: number;
    };
    searchTreeItems: {
        [key: string]: Object;
    }[];
    editorLabelElement: HTMLLabelElement;
    isDataOverflow: boolean;
    isDateField: boolean;
    dataType: string;
    nodeStateModified: NodeStateModified;
    dataSourceUpdate: DataSourceUpdate;
    eventBase: EventBase;
    errorDialog: ErrorDialog;
    filterDialog: FilterDialog;
    keyboardModule: CommonKeyboardInteraction;
    /**
     * Constructor for Pivot Common class
     * @param  {CommonArgs} control?

     */
    constructor(control: CommonArgs);
    /**
     * To destroy the groupingbar
     * @return {void}

     */
    destroy(): void;
}
