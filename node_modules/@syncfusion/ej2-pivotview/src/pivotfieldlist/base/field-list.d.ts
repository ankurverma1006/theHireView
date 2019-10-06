import { Component, EmitType, Internationalization } from '@syncfusion/ej2-base';
import { L10n, ModuleDeclaration } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged } from '@syncfusion/ej2-base';
import { PivotEngine, IFieldListOptions, IDataOptions } from '../../base/engine';
import { ISort, IFilter, IFieldOptions, ICalculatedFields, IDataSet } from '../../base/engine';
import { PivotFieldListModel } from './field-list-model';
import { LoadEventArgs, EnginePopulatingEventArgs, EnginePopulatedEventArgs, AggregateEventArgs } from '../../common/base/interface';
import { FieldDroppedEventArgs } from '../../common/base/interface';
import { Mode } from '../../common/base/enum';
import { PivotCommon } from '../../common/base/pivot-common';
import { Render } from '../renderer/renderer';
import { DialogRenderer } from '../renderer/dialog-renderer';
import { TreeViewRenderer } from '../renderer/tree-renderer';
import { AxisTableRenderer } from '../renderer/axis-table-renderer';
import { AxisFieldRenderer } from '../renderer/axis-field-renderer';
import { PivotButton } from '../../common/actions/pivot-button';
import { PivotView } from '../../pivotview/base/pivotview';
import { DataSourceSettingsModel } from '../../pivotview/model/datasourcesettings-model';
import { CalculatedField } from '../../common/calculatedfield/calculated-field';
import { PivotContextMenu } from '../../common/popups/context-menu';
import { OlapEngine, IOlapFieldListOptions } from '../../base/olap/engine';
/**
 * Represents the PivotFieldList component.
 * ```html
 * <div id="pivotfieldlist"></div>
 * <script>
 *  var pivotfieldlistObj = new PivotFieldList({ });
 *  pivotfieldlistObj.appendTo("#pivotfieldlist");
 * </script>
 * ```
 */
export declare class PivotFieldList extends Component<HTMLElement> implements INotifyPropertyChanged {
    globalize: Internationalization;
    localeObj: L10n;
    isAdaptive: Boolean;
    pivotFieldList: IFieldListOptions | IOlapFieldListOptions;
    dataType: string;
    engineModule: PivotEngine;
    olapEngineModule: OlapEngine;
    isDragging: boolean;
    fieldListSpinnerElement: Element;
    clonedDataSource: DataSourceSettingsModel;
    clonedFieldList: IFieldListOptions | IOlapFieldListOptions;
    isRequiredUpdate: boolean;
    clonedDataSet: IDataSet[];
    clonedReport: IDataOptions;
    lastSortInfo: ISort;
    lastFilterInfo: IFilter;
    lastAggregationInfo: IFieldOptions;
    lastCalcFieldInfo: ICalculatedFields;
    private defaultLocale;
    private captionData;
    pivotGridModule: PivotView;
    renderModule: Render;
    dialogRenderer: DialogRenderer;
    treeViewModule: TreeViewRenderer;
    axisTableModule: AxisTableRenderer;
    pivotCommon: PivotCommon;
    axisFieldModule: AxisFieldRenderer;
    pivotButtonModule: PivotButton;
    calculatedFieldModule: CalculatedField;
    contextMenuModule: PivotContextMenu;
    /**
     * It allows to feed raw data, dataSource and properties to customize the data source
     */
    dataSourceSettings: DataSourceSettingsModel;
    /**
     * It allows to render Pivot Field List at fixed or popup mode.
     * The possible values are:

     */
    renderMode: Mode;
    /**
     * Specifies the `target` element where the Pivot Field List dialog should be displayed.
     * If the user set the specific `target` element for Pivot Field List, it will be positioned based on the `target`.
     * The targetID should works only when the Pivot Field List is in 'Dynamic' mode.

     */
    target: HTMLElement | string;
    /**
     * Specifies the CSS class name to be added for Pivot Field List element.
     * User can add single or multiple CSS classes.

     */
    cssClass: string;
    /**
     * It allows to enable calculated field in Pivot Field List.

     */
    allowCalculatedField: boolean;
    /**
     * It shows a common button for value fields to move together in column or row axis

     */
    showValuesButton: boolean;
    /**
     * If `allowDeferLayoutUpdate` is set to true, then it will enable defer layout update to pivotfieldlist.

     */
    allowDeferLayoutUpdate: boolean;
    /**
     * It allows to set the maximum number of nodes to be displayed in the member editor.

     */
    maxNodeLimitInMemberEditor: number;
    /**
     * If `loadOnDemandInMemberEditor` is set to false,
     * then it will load all the level members from cube when doing member filtering initially.
     * Note: This may cause performance lag based on members count that fetch from cube
     * while the member editor pop-up opens for the first time alone.

     */
    loadOnDemandInMemberEditor: boolean;
    /**
     * It allows to customize the spinner.

     */
    spinnerTemplate: string;
    /**
     * This allows any customization of Pivot Field List properties before rendering.
     * @event

     */
    load: EmitType<LoadEventArgs>;
    /**
     * This allows any customization of Pivot Field List properties before pivotengine populate.
     * @event

     */
    enginePopulating: EmitType<EnginePopulatingEventArgs>;
    /**
     * This allows any customization of Pivot Field List properties before pivotengine populate.
     * @event

     */
    enginePopulated: EmitType<EnginePopulatedEventArgs>;
    /**
     * Triggers when a field getting dropped into any axis.
     * @event

     */
    onFieldDropped: EmitType<FieldDroppedEventArgs>;
    /**
     * This allows to change the cell value.
     * @event

     */
    aggregateCellInfo: EmitType<AggregateEventArgs>;
    /**
     * Triggers when data source is populated in the Pivot Field List.
     * @event
     */
    dataBound: EmitType<Object>;
    /**
     * Triggers when data source is created in the Pivot Field List.
     * @event
     */
    created: EmitType<Object>;
    /**
     * Triggers when data source is destroyed in the Pivot Field List.
     * @event
     */
    destroyed: EmitType<Object>;
    /**
     * Constructor for creating the widget
     * @param  {PivotFieldListModel} options?
     * @param  {string|HTMLButtonElement} element?
     */
    constructor(options?: PivotFieldListModel, element?: string | HTMLElement);
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}

     */
    requiredModules(): ModuleDeclaration[];
    /**
     * For internal use only - Initialize the event handler;
     * @private
     */
    protected preRender(): void;
    private frameCustomProperties;
    /**
     * Initialize the control rendering
     * @returns void
     * @private
     */
    render(): void;
    /**
     * Binding events to the Pivot Field List element.

     */
    private wireEvent;
    /**
     * Unbinding events from the element on widget destroy.

     */
    private unWireEvent;
    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     */
    getPersistData(): string;
    /**
     * Get component name.
     * @returns string
     * @private
     */
    getModuleName(): string;
    /**
     * Called internally if any of the property value changed.

     */
    onPropertyChanged(newProp: PivotFieldListModel, oldProp: PivotFieldListModel): void;
    private initEngine;
    private generateData;
    private getValueCellInfo;
    private getData;
    private executeQuery;
    private fieldListRender;
    private getFieldCaption;
    private getFields;
    /**
     * Updates the PivotEngine using dataSource from Pivot Field List component.
     * @method updateDataSource
     * @return {void}

     */
    updateDataSource(isTreeViewRefresh?: boolean, isEngineRefresh?: boolean): void;
    private updateOlapDataSource;
    /**
     * Updates the Pivot Field List component using dataSource from PivotView component.
     * @method updateControl
     * @return {void}
     */
    update(control: PivotView): void;
    /**
     * Updates the PivotView component using dataSource from Pivot Field List component.
     * @method refreshTargetControl
     * @return {void}
     */
    updateView(control: PivotView): void;
    /**
     * Called internally to trigger populate event.

     */
    triggerPopulateEvent(): void;
    /**
     * Destroys the Field Table component.
     * @method destroy
     * @return {void}
     */
    destroy(): void;
}
