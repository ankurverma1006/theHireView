/**
 * @private
 */
export declare class XmlHttpRequestHandler {
    /**
     * Specifies the URL to which request to be sent.

     */
    url: string;
    /**
     * @private
     */
    contentType: string;
    /**
     * Specifies the responseType to which request response.

     */
    responseType: XMLHttpRequestResponseType;
    /**
     * A boolean value indicating whether the request should be sent asynchronous or not.

     */
    mode: boolean;
    private xmlHttpRequest;
    /**
     * Send the request to server
     * @param  {object} jsonObject - To send to service
     */
    send(jsonObject: object): void;
    private sendRequest;
    private stateChange;
    private error;
    /**
     * Specifies callback function to be triggered after XmlHttpRequest is succeeded.
     * The callback will contain server response as the parameter.
     * @event
     */
    onSuccess: Function;
    /**
     * Specifies callback function to be triggered after XmlHttpRequest is got failed.
     * The callback will contain server response as the parameter.
     * @event
     */
    onFailure: Function;
    /**
     * Specifies callback function to be triggered after XmlHttpRequest is got error.
     * The callback will contain server response as the parameter.
     * @event
     */
    onError: Function;
    private successHandler;
    private failureHandler;
    private errorHandler;
}
