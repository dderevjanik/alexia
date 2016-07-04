/**
 * Handles request and calls done when finished
 * @param {Object} app - Application object
 * @param {Object} request - Request JSON to be handled
 * @param {Function} handlers - Handlers to be called. Contains onStart, onEnd, actionFail
 * @param {Function} done - Callback to be called when request is handled. Callback is called with one argument - response JSON
 */
declare const handleRequest: (app: any, request: any, handlers: any, done: any) => void;
export = handleRequest;
