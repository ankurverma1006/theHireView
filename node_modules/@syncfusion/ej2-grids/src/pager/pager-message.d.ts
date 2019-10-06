import { Pager, IRender } from './pager';
/**
 * `PagerMessage` module is used to display pager information.
 */
export declare class PagerMessage implements IRender {
    private pageNoMsgElem;
    private pageCountMsgElem;
    private pagerModule;
    /**
     * Constructor for externalMessage module

     */
    constructor(pagerModule?: Pager);
    /**
     * The function is used to render pager message

     */
    render(): void;
    /**
     * Refreshes the pager information.
     */
    refresh(): void;
    /**
     * Hides the Pager information.
     */
    hideMessage(): void;
    /**
     * Shows the Pager information.
     */
    showMessage(): void;
    /**
     * To destroy the PagerMessage
     * @method destroy
     * @return {void}

     */
    destroy(): void;
    private format;
}
