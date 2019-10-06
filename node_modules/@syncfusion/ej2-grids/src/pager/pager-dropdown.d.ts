import { Pager } from './pager';
/**
 * IPager interface

 */
export interface IPager {
    newProp: {
        value: number | string | boolean;
    };
}
/**
 * `PagerDropDown` module handles selected pageSize from DropDownList.
 */
export declare class PagerDropDown {
    private pagerCons;
    private dropDownListObject;
    private pagerDropDownDiv;
    private pagerModule;
    /**
     * Constructor for pager module

     */
    constructor(pagerModule?: Pager);
    /**
     * For internal use only - Get the module name.
     * @private

     */
    protected getModuleName(): string;
    /**
     * The function is used to render pager dropdown

     */
    render(): void;
    /**
     * For internal use only - Get the pagesize.
     * @private

     */
    private onChange;
    private beforeValueChange;
    private convertValue;
    setDropDownValue(prop: string, value: string | number | Object | boolean): void;
    addEventListener(): void;
    removeEventListener(): void;
    /**
     * To destroy the Pagerdropdown
     * @method destroy
     * @return {void}

     */
    destroy(args?: {
        requestType: string;
    }): void;
}
