import { PdfViewer } from '../index';
/**

 */
export declare class AjaxHandler {
    /**
     * Specifies the URL to which request to be sent.

     */
    url: string;
    /**
     * Specifies the URL to which request to be sent.

     */
    type: string;
    /**
     * Specifies the responseType to which request response.

     */
    responseType: XMLHttpRequestResponseType;
    /**
     * A boolean value indicating whether the request should be sent asynchronous or not.

     * @private
     */
    mode: boolean;
    /**
     * Specifies the ContentType to which request to be sent

     * @private
     */
    contentType: string;
    private httpRequest;
    private pdfViewer;
    /**
     * Constructor for Ajax class
     * @param  {PdfViewer} pdfviewer
     * @returns defaultType
     * @private
     */
    constructor(pdfviewer: PdfViewer);
    /**
     * Send the request to server
     * @param  {object} jsonObj - To send to service
     * @private
     */
    send(jsonObj: object): void;
    private sendRequest;
    private stateChange;
    private error;
    /**
     * Specifies callback function to be triggered after XmlHttpRequest is succeeded.
     * The callback will contain server response as the parameter.
     * @event
     * @private
     */
    onSuccess: Function;
    /**
     * Specifies callback function to be triggered after XmlHttpRequest is got failed.
     * The callback will contain server response as the parameter.
     * @event
     * @private
     */
    onFailure: Function;
    /**
     * Specifies callback function to be triggered after XmlHttpRequest is got error.
     * The callback will contain server response as the parameter.
     * @event
     * @private
     */
    onError: Function;
    private successHandler;
    private failureHandler;
    private errorHandler;
    private setCustomAjaxHeaders;
}
