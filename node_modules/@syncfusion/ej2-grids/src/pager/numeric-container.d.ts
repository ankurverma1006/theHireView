import { Pager, IRender } from './pager';
/**
 * `NumericContainer` module handles rendering and refreshing numeric container.
 */
export declare class NumericContainer implements IRender {
    private element;
    private first;
    private prev;
    private PP;
    private NP;
    private next;
    private last;
    private links;
    private pagerElement;
    private pagerModule;
    /**
     * Constructor for numericContainer module

     */
    constructor(pagerModule?: Pager);
    /**
     * The function is used to render numericContainer

     */
    render(): void;
    /**
     * Refreshes the numeric container of Pager.
     */
    refresh(): void;
    /**
     * The function is used to refresh refreshNumericLinks

     */
    refreshNumericLinks(): void;
    /**
     * Binding events to the element while component creation

     */
    wireEvents(): void;
    /**
     * Unbinding events from the element while component destroy

     */
    unwireEvents(): void;
    /**
     * To destroy the PagerMessage
     * @method destroy
     * @return {void}

     */
    destroy(): void;
    private renderNumericContainer;
    private renderFirstNPrev;
    private renderPrevPagerSet;
    private renderNextPagerSet;
    private renderNextNLast;
    private clickHandler;
    private updateLinksHtml;
    private updateStyles;
    private updateFirstNPrevStyles;
    private updatePrevPagerSetStyles;
    private updateNextPagerSetStyles;
    private updateNextNLastStyles;
}
