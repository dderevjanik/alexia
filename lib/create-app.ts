'use strict';
import _ = require('lodash');
import handleRequest = require('./handle-request');
import createIntent = require('./create-intent');
import createCustomSlot = require('./create-custom-slot');
import generateSpeechAssets = require('./generate-speech-assets');
import builtInIntentsMap = require('./data/built-in-intents-map');
import IAction = require('./interfaces/iaction');
import IAppHandlers = require('./interfaces/iapp-handlers');
import IAppOptions = require('./interfaces/iapp-options');

const builtInIntentsList: string[] = _.keys(builtInIntentsMap).join(', ');

/**
 * Create new app
 * @param {string} name - App name
 * @param {Object} [options] - Additional app options
 * @param {string} [options.version] - App version
 * @param {string[]} [options.ids] - Array of app ids. Only requests with supported app ids will be handled
 */
const createApp = (name: string, options: IAppOptions) => {

    const app = {
        name: name,
        options: options,
        intents: {},
        customSlots: {},
        actions: [],
        onStart: (handler: () => string) => null,
        onEnd: (handler: () => string) => null,
        defaultActionFail: (handler: () => string) => null,
        intent: (name: string, richUtterances: string|string[], handler: () => void) => null,
        builtInIntent: (name:string, utterances: string|string[], handler: () => void) => null,
        handle: (request, done: () => void) => null,
        customSlot: (name: string, samples: string[]) => null,
        action: (action) => null,
        speechAssets: () => null
    };

    const handlers: IAppHandlers = {
        onStart: () => ('Welcome'),
        onEnd: () => ('Bye'),
        defaultActionFail: () => ('Sorry, your command is invalid')
    };

    /**
     * Sets handler to be called on application start
     * @param {function} handler - Handler to be called when app is started without intent
     */
    app.onStart = (handler: () => string) => {
        handlers.onStart = handler;
    };

    /**
     * Sets handler to be called on application end
     * @param {function} handler - Handler to be called when application is unexpectedly terminated
     */
    app.onEnd = (handler: () => string) => {
        handlers.onEnd = handler;
    };

    /**
     * Sets handler to be called on default action fail
     * @param {function} handler - Default handler to be called when action can not be invoked
     */
    app.defaultActionFail = (handler: () => string) => {
        handlers.defaultActionFail = handler;
    };

    /**
     * Creates intent
     * @param {string} name - Intent name. Should not be equal to built-in intent name. It is possible to use this function to create built-in intents but utterances are required argument and you need to specify full built-in intent name f.e. `AMAZON.StopIntent`. See `{@link app.builtInIntent}`. If not specified (null, undefined or empty string), automatically generated intent name is used but we recommend to name each intent
     * @param {(string|string[])} richUtterances - one or more utterances. Utterances contain utterance description with slots types. Example: `My age is {age:Number}`
     * @param {function} handler - Function to be called when intent is invoked
     */
    app.intent = (name: string, richUtterances: string|string[], handler: (slots?: any, attrs?: any) => string) => {
        const intent = createIntent(app.intents, name, richUtterances, handler);
        app.intents[intent.name] = intent;

        return intent;
    };

    /**
     * Creates built-int intent.
     * Essentialy the same as `intent` but with optional `utterances` since we need to specify each built-in intent has its own set of default utterances you are not required to extend
     * @param {string} name - Built-in Intent name. Must be one of: `cancel`, `help`, `next`, `no`, `pause`, `previous`, `repeat`, `resume`, `startOver`, `stop`, `yes`
     * @param {(string|string[]|function)} [utterances] - one or more utterances without slots. Could be ommited and handler could be 2nd parameter instead
     * @param {function} handler - Function to be called when intent is invoked
     */
    app.builtInIntent = (name:string, utterances: string|string[], handler: () => void) => {
        // Validate built-in intent name
        if(!builtInIntentsMap[name]) {
            throw new Error(`Built-in Intent name ${name} is invalid. Please use one of: ${builtInIntentsList}`);
        }

        // Shift ommited arguments (utternaces are optional)
        if(!handler) {
            handler = utterances;
            utterances = undefined;
        }

        app.intent(name, utterances, handler);
    };

    /**
     * Handles request and calls done when finished
     * @param {Object} request - Request JSON to be handled.
     * @param {Function} done - Callback to be called when request is handled. Callback is called with one argument - response JSON
     */
    app.handle = (request, done: () => void) =>
        handleRequest(app, request, handlers, done);

    /**
     * Creates custom slot
     * @param {string} name - Name of the custom slot
     * @param {string[]} samples - Array of custom slot samples
     */
    app.customSlot = (name: string, samples: string[]) => {
        const customSlot = createCustomSlot(app.customSlots, name, samples);
        app.customSlots[name] = customSlot;
    };

    /**
     * Creates action
     * @param {string} action - Action object
     * @param {string} action.from - Name of the intent to allow transition from
     * @param {string} action.to - Name of th eintent to allow transition to
     * @param {function} action.if - Function returning boolean whether this transition should be handled.
     * @param {function} action.fail - Handler to be called if `action.if` returned `false`
     */
    app.action = (action: IAction) => {
        app.actions.push({
            from: typeof(action.from) === 'string' ? action.from : action.from.name,
            to: typeof(action.to) === 'string' ? action.to : action.to.name,
            //NOTE - what about pass or done ?
            if: action.if,
            fail: action.fail
        });
    };

    /**
     * Generates speech assets object: {schema, utterances, customSlots}
     */
    app.speechAssets = () =>
        generateSpeechAssets(app);

    return app;
};

export = createApp;
