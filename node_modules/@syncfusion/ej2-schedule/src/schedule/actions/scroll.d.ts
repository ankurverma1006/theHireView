import { Schedule } from '../base/schedule';
/**
 * `Scroll` module
 */
export declare class Scroll {
    private parent;
    /**
     * Constructor for the scrolling.

     */
    constructor(parent?: Schedule);
    /**
     * For internal use only - Get the module name.
     * @private
     */
    protected getModuleName(): string;
    /**

     */
    setWidth(): void;
    /**

     */
    setHeight(): void;
    /**

     */
    addEventListener(): void;
    /**

     */
    removeEventListener(): void;
    /**

     */
    private setDimensions;
    /**

     */
    private onPropertyChanged;
    /**

     */
    destroy(): void;
}
