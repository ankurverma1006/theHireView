import { Component, L10n, ModuleDeclaration } from '@syncfusion/ej2-base';
import { INotifyPropertyChanged, EmitType } from '@syncfusion/ej2-base';
import { RenderingMode, BarcodeType } from './enum/enum';
import { BarcodeGeneratorModel } from './barcode-model';
import { DisplayTextModel } from './primitives/displaytext-model';
import { MarginModel } from './primitives/margin-model';
/**
 * Represents the Barcode control
 * ```html
 * <div id='barcode'/>
 * ```
 * ```typescript
 * let barcode: Barcode = new Barcode({
 * width:'1000px', height:'500px' });
 * barcode.appendTo('#barcode');
 * ```
 */
export declare class BarcodeGenerator extends Component<HTMLElement> implements INotifyPropertyChanged {
    /**
     * Defines the width of the barcode model.
     * ```html
     * <div id='barcode'/>
     * ```
     * ```typescript
     * let barcode: Barcode = new Barcode({
     * width:'1000px', height:'500px' });
     * barcode.appendTo('#barcode');
     * ```

     */
    width: string | number;
    /**
     * Defines the height of the barcode model.
     * ```html
     * <div id='barcode'/>
     * ```
     * ```typescript
     * let barcode: Barcode = new Barcode({
     * height:'1000px', height:'500px' });
     * barcode.appendTo('#barcode');
     * ```

     */
    height: string | number;
    /**
     * Defines the barcode rendering mode.
     * * SVG - Renders the bar-code objects as SVG elements
     * * Canvas - Renders the bar-code in a canvas

     */
    mode: RenderingMode;
    /**
     * Defines the type of barcode to be rendered.

     */
    type: BarcodeType;
    /**
     * Defines the value of the barcode to be rendered.

     */
    value: string;
    /**
     * Defines the checksum for the barcode.

     */
    enableCheckSum: boolean;
    /**
     * Defines the text properties for the barcode.

     */
    displayText: DisplayTextModel;
    /**
     * Defines the margin properties for the barcode.

     */
    margin: MarginModel;
    /**
     * Defines the background color of the barcode.

     */
    backgroundColor: string;
    /**
     * Defines the forecolor of the barcode.

     */
    foreColor: string;
    /**
     * Triggers if you enter any invalid character.
     * @event
     */
    invalid: EmitType<Object>;
    /** @private */
    localeObj: L10n;
    /** @private */
    private defaultLocale;
    private barcodeCanvas;
    private barcodeRenderer;
    /**
     * Constructor for creating the widget
     */
    constructor(options?: BarcodeGeneratorModel, element?: HTMLElement | string);
    private triggerEvent;
    onPropertyChanged(newProp: BarcodeGeneratorModel, oldProp: BarcodeGeneratorModel): void;
    private initialize;
    private renderElements;
    private refreshCanvasBarcode;
    private clearCanvas;
    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     */
    getPersistData(): string;
    /**
     * @private
     * @param real
     */
    private getElementSize;
    protected preRender(): void;
    private initializePrivateVariables;
    /**
     * Method to set culture for chart
     */
    private setCulture;
    /**
     * Renders the barcode control with nodes and connectors
     */
    render(): void;
    /**
     * Returns the module name of the barcode
     */
    getModuleName(): string;
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    requiredModules(): ModuleDeclaration[];
    /**
     * Destroys the barcode control
     */
    destroy(): void;
}
