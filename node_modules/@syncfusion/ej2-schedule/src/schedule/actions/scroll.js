import { formatUnit } from '@syncfusion/ej2-base';
import { contentReady, uiUpdate, scrollUiUpdate } from '../base/constant';
/**
 * `Scroll` module
 */
var Scroll = /** @class */ (function () {
    /**
     * Constructor for the scrolling.

     */
    function Scroll(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    /**
     * For internal use only - Get the module name.
     * @private
     */
    Scroll.prototype.getModuleName = function () {
        return 'scroll';
    };
    /**

     */
    Scroll.prototype.setWidth = function () {
        this.parent.element.style.width = formatUnit(this.parent.width);
    };
    /**

     */
    Scroll.prototype.setHeight = function () {
        this.parent.element.style.height = formatUnit(this.parent.height);
    };
    /**

     */
    Scroll.prototype.addEventListener = function () {
        this.parent.on(contentReady, this.setDimensions, this);
        this.parent.on(uiUpdate, this.onPropertyChanged, this);
    };
    /**

     */
    Scroll.prototype.removeEventListener = function () {
        this.parent.off(contentReady, this.setDimensions);
        this.parent.off(uiUpdate, this.onPropertyChanged);
    };
    /**

     */
    Scroll.prototype.setDimensions = function () {
        this.setWidth();
        this.setHeight();
        var data = { cssProperties: this.parent.getCssProperties(), module: this.getModuleName() };
        this.parent.notify(scrollUiUpdate, data);
    };
    /**

     */
    Scroll.prototype.onPropertyChanged = function (e) {
        this.setDimensions();
    };
    /**

     */
    Scroll.prototype.destroy = function () {
        this.removeEventListener();
    };
    return Scroll;
}());
export { Scroll };
