import { Component, INotifyPropertyChanged, EmitType } from '@syncfusion/ej2-base';
import { ModuleDeclaration } from '@syncfusion/ej2-base';
import { ButtonModel } from '@syncfusion/ej2-buttons';
import { RichTextEditorModel } from '@syncfusion/ej2-richtexteditor';
import { DatePickerModel, DateRange } from '@syncfusion/ej2-calendars';
import { DateTimePickerModel, DateRangePickerModel, TimePickerModel } from '@syncfusion/ej2-calendars';
import { NumericTextBoxModel, TextBoxModel } from '@syncfusion/ej2-inputs';
import { ColorPickerModel, MaskedTextBoxModel, SliderModel } from '@syncfusion/ej2-inputs';
import { AutoCompleteModel, ComboBoxModel, DropDownListModel, MultiSelectModel } from '@syncfusion/ej2-dropdowns';
import { Rte } from '../modules/rte';
import { Slider } from '../modules/slider';
import { ComboBox } from '../modules/combo-box';
import { TimePicker } from '../modules/time-picker';
import { MultiSelect } from '../modules/multi-select';
import { ColorPicker } from '../modules/color-picker';
import { AutoComplete } from '../modules/auto-complete';
import { DateRangePicker } from '../modules/date-range-picker';
import { InPlaceEditorModel } from './inplace-editor-model';
import { PopupSettingsModel } from './models-model';
import { ActionBeginEventArgs, ActionEventArgs, ValidateEventArgs, BeginEditEventArgs } from './interface';
/**
 * Specifies the mode to be render while editing.
 */
export declare type RenderMode = 'Inline' | 'Popup';
/**
 * Specifies the action to be perform when user clicks outside the container, that is focus out of editable content.
 */
export declare type ActionBlur = 'Cancel' | 'Submit' | 'Ignore';
/**
 * Specifies the event action of input to enter edit mode instead of using edit icon.
 */
export declare type EditableType = 'Click' | 'DblClick' | 'EditIconClick';
/**
 * Specifies the adaptor type that are used DataManager to communicate with DataSource.
 */
export declare type AdaptorType = 'UrlAdaptor' | 'ODataV4Adaptor' | 'WebApiAdaptor';
/**
 * Specifies the type of components that integrated with In-place editor to make it as editable.
 */
export declare type InputType = 'AutoComplete' | 'Color' | 'ComboBox' | 'Date' | 'DateRange' | 'DateTime' | 'DropDownList' | 'Mask' | 'MultiSelect' | 'Numeric' | 'RTE' | 'Slider' | 'Text' | 'Time';
/**
 * ```html
 * * The In-place editor control is used to edit an element in a place and to update the value in server.
 * <div id='element' />
 * <script>
 *   var editorObj = new InPlaceEditor();
 *   editorObj.appendTo('#element');
 * </script>
 * ```
 */
export declare class InPlaceEditor extends Component<HTMLElement> implements INotifyPropertyChanged {
    private tipObj;
    private touchModule;
    private loaderWidth;
    private loader;
    private editEle;
    private spinObj;
    private formEle;
    private valueEle;
    private titleEle;
    private editIcon;
    private valueWrap;
    private templateEle;
    private containerEle;
    private initRender;
    private inlineWrapper;
    private isTemplate;
    private formValidate;
    private componentObj;
    private isExtModule;
    private submitBtn;
    private cancelBtn;
    private isClearTarget;
    private btnElements;
    private dataManager;
    private componentRoot;
    private dataAdaptor;
    private divComponents;
    private clearComponents;
    private dateType;
    private inputDataEle;
    private dropDownEle;
    private moduleList;
    private afterOpenEvent;
    /**

     */
    printValue: string;
    /**

     */
    needsID: boolean;
    /**

     */
    atcModule: AutoComplete;
    /**

     */
    colorModule: ColorPicker;
    /**

     */
    comboBoxModule: ComboBox;
    /**

     */
    dateRangeModule: DateRangePicker;
    /**

     */
    multiSelectModule: MultiSelect;
    /**

     */
    rteModule: Rte;
    /**

     */
    sliderModule: Slider;
    /**

     */
    timeModule: TimePicker;
    /**
     * * Specifies the name of the field which is used to map data to the server.
     * If name is not given, then component ID is taken as mapping field name.

     */
    name: string;
    /**
     * Specifies the display value for input when original input value is empty.


     */
    value: string | number | Date | string[] | Date[] | number[];
    /**
     * Specifies the HTML element ID as a string that can be added as a editable field.


     */
    template: string | HTMLElement;
    /**
     * Defines single/multiple classes (separated by space) to be used for customization of In-place editor.

     */
    cssClass: string;
    /**
     * Defines the unique primary key of editable field which can be used for saving data in data-base.

     */
    primaryKey: string | number;
    /**
     * Sets the text to be shown when an element has 'Empty' value.

     */
    emptyText: string;
    /**
     * Gets the url for server submit action.

     */
    url: string;
    /**
     * Specifies the mode to be render while editing. The possible modes are :
     *
     * - `Inline`: Editable content is displayed as inline text and ok/cancel buttons are displayed at right bottom corner of input.
     * - `Popup`: Editable content and ok/cancel buttons are displayed inside popup while editing.

     */
    mode: RenderMode;
    /**
     * Specifies the adaptor type that are used DataManager to communicate with DataSource. The possible values are,
     *
     * - `UrlAdaptor`: Base adaptor for interacting with remote data services.
     * - `ODataV4Adaptor`: Used to interact with ODataV4 service.
     * - `WebApiAdaptor`: Used to interact with Web api created with OData endpoint.

     */
    adaptor: AdaptorType;
    /**
     * Specifies the type of components that integrated with In-place editor to make it as editable.

     */
    type: InputType;
    /**
     * Specifies the event action of input to enter edit mode instead of using edit icon. The possible values are:
     *
     * - `Click`: Do the single click action on input to enter into the edit mode.
     * - `DblClick`: Do the single double click action on input to enter into the edit mode.
     * - `EditIconClick`: Disables the editing of event action of input and allows user to edit only through edit icon.

     */
    editableOn: EditableType;
    /**
     * Specifies the action to be perform when user clicks outside the container, that is focus out of editable content.
     * The possible options are,
     *
     * - `Cancel`: Cancel's the editing and resets the old content.
     * - `Submit`: Submit the edited content to the server.
     * - `Ignore`: No action is perform with this type and allows to have many containers open.

     */
    actionOnBlur: ActionBlur;
    /**
     * Enable or disable persisting component's state between page reloads. If enabled, following list of states will be persisted.
     * 1. value

     */
    enablePersistence: boolean;
    /**
     * Specifies whether to enable editing mode or not.

     */
    disabled: boolean;
    /**
     * Used to show/hide the ok/cancel buttons of In-place editor.

     */
    showButtons: boolean;
    /**
     * Specifies to show/hide the editing mode.

     */
    enableEditMode: boolean;
    /**
     * Sets to trigger the submit action with enter key pressing of input.

     */
    submitOnEnter: boolean;
    /**
     * Specifies the object to customize popup display settings like positions, animation etc.

     */
    popupSettings: PopupSettingsModel;
    /**
     * Specifies the model object configuration for the integrated components like AutoComplete, DatePicker,NumericTextBox, etc.

     */
    model: AutoCompleteModel | ColorPickerModel | ComboBoxModel | DatePickerModel | DateRangePickerModel | DateTimePickerModel | DropDownListModel | MaskedTextBoxModel | MultiSelectModel | NumericTextBoxModel | RichTextEditorModel | SliderModel | TextBoxModel | TimePickerModel;
    /**
     * Used to customize the "Save" button UI appearance by defining Button model configuration.

     */
    saveButton: ButtonModel;
    /**
     * Used to customize the "Cancel" button UI appearance by defining Button model configuration.

     */
    cancelButton: ButtonModel;
    /**
     * Maps the validation rules for the input.

     */
    validationRules: {
        [name: string]: {
            [rule: string]: Object;
        };
    };
    /**
     * The event will be fired once the component rendering is completed.
     * @event

     */
    created: EmitType<Event>;
    /**
     * The event will be fired before the data submitted to the server.
     * @event

     */
    actionBegin: EmitType<ActionBeginEventArgs>;
    /**
     * The event will be fired when data submitted successfully to the server.
     * @event

     */
    actionSuccess: EmitType<ActionEventArgs>;
    /**
     * The event will be fired when data submission failed.
     * @event

     */
    actionFailure: EmitType<ActionEventArgs>;
    /**
     * The event will be fired while validating current value.
     * @event

     */
    validating: EmitType<ValidateEventArgs>;
    /**
     * The event will be fired before changing the mode from default to edit mode.
     * @event
     */
    beginEdit: EmitType<BeginEditEventArgs>;
    /**
     * The event will be fired when the component gets destroyed.
     * @event

     */
    destroyed: EmitType<Event>;
    /**
     * Initialize the event handler
     * @private
     */
    protected preRender(): void;
    /**
     * To Initialize the In-place editor rendering
     * @private
     */
    protected render(): void;
    /**
     * Initializes a new instance of the In-place editor class.
     * @param options  - Specifies In-place editor model properties as options.
     * @param element  - Specifies the element for which In-place editor applies.
     */
    constructor(options?: InPlaceEditorModel, element?: string | HTMLElement);
    private setClass;
    private appendValueElement;
    private renderValue;
    private renderEditor;
    private renderAndOpen;
    private checkRemoteData;
    private showDropDownPopup;
    private setAttribute;
    private renderControl;
    private appendButtons;
    private renderButtons;
    private createButtons;
    private renderComponent;
    private updateAdaptor;
    private loadSpinner;
    private removeSpinner;
    private getEditElement;
    private getLocale;
    private checkValue;
    extendModelValue(val: string | number | boolean | Date | DateRange | string[] | Date[] | number[] | boolean[]): void;
    private updateValue;
    private updateModelValue;
    setValue(): void;
    private getDropDownsValue;
    private getSendValue;
    private getRenderValue;
    private setRtl;
    private setFocus;
    private removeEditor;
    private destroyComponents;
    private destroyButtons;
    private getQuery;
    private sendValue;
    private isEmpty;
    private checkIsTemplate;
    private templateCompile;
    private appendTemplate;
    private disable;
    private enableEditor;
    private checkValidation;
    private toggleErrorClass;
    private updateArrow;
    private triggerSuccess;
    private wireEvents;
    private wireDocEvent;
    private wireEditEvent;
    private wireEditorKeyDownEvent;
    private wireBtnEvents;
    private unWireEvents;
    private unWireDocEvent;
    private unWireEditEvent;
    private unWireEditorKeyDownEvent;
    private submitPrevent;
    private btnKeyDownHandler;
    private afterOpenHandler;
    private popMouseDown;
    private doubleTapHandler;
    private clickHandler;
    private submitHandler;
    private cancelHandler;
    private popClickHandler;
    private successHandler;
    private failureHandler;
    private enterKeyDownHandler;
    private valueKeyDownHandler;
    private mouseDownHandler;
    private scrollResizeHandler;
    private docClickHandler;
    /**
     * Validate current editor value.
     * @returns void
     */
    validate(): void;
    /**
     * Submit the edited input value to the server.
     * @returns void
     */
    save(): void;
    /**
     * Removes the control from the DOM and also removes all its related events.
     * @returns void
     */
    destroy(): void;
    /**
     * Get the properties to be maintained in the persisted state.
     * @returns string
     */
    protected getPersistData(): string;
    /**
     * To provide the array of modules needed for component rendering
     * @return {ModuleDeclaration[]}

     */
    requiredModules(): ModuleDeclaration[];
    /**
     * Returns the current module name.
     * @returns string
     * @private
     */
    protected getModuleName(): string;
    /**
     * Gets called when the model property changes.The data that describes the old and new values of property that changed.
     * @param  {InPlaceEditorModel} newProp
     * @param  {InPlaceEditorModel} oldProp
     * @returns void
     * @private
     */
    onPropertyChanged(newProp: InPlaceEditorModel, oldProp: InPlaceEditorModel): void;
}
