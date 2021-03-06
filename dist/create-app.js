'use strict';
const _ = require('lodash');
const handleRequest = require('./handle-request');
const createIntent = require('./create-intent');
const createCustomSlot = require('./create-custom-slot');
const generateSpeechAssets = require('./generate-speech-assets');
const builtInIntentsMap = require('./data/built-in-intents-map');
const builtInIntentsList = _.keys(builtInIntentsMap).join(', ');
/**
 * Create new app
 * @param {string} name - App name
 * @param {Object} [options] - Additional app options
 * @param {string} [options.version] - App version
 * @param {string[]} [options.ids] - Array of app ids. Only requests with supported app ids will be handled
 */
const createApp = (name, options) => {
    const app = {
        name: name,
        options: options,
        intents: {},
        customSlots: {},
        actions: [],
        onStart: (handler) => null,
        onEnd: (handler) => null,
        defaultActionFail: (handler) => null,
        intent: (name, richUtterances, handler) => null,
        builtInIntent: (name, utterances, handler) => null,
        handle: (request, done) => null,
        customSlot: (name, samples) => null,
        action: (action) => null,
        speechAssets: () => null
    };
    const handlers = {
        onStart: () => ('Welcome'),
        onEnd: () => ('Bye'),
        defaultActionFail: () => ('Sorry, your command is invalid')
    };
    /**
     * Sets handler to be called on application start
     * @param {function} handler - Handler to be called when app is started without intent
     */
    app.onStart = (handler) => {
        handlers.onStart = handler;
    };
    /**
     * Sets handler to be called on application end
     * @param {function} handler - Handler to be called when application is unexpectedly terminated
     */
    app.onEnd = (handler) => {
        handlers.onEnd = handler;
    };
    /**
     * Sets handler to be called on default action fail
     * @param {function} handler - Default handler to be called when action can not be invoked
     */
    app.defaultActionFail = (handler) => {
        handlers.defaultActionFail = handler;
    };
    /**
     * Creates intent
     * @param {string} name - Intent name. Should not be equal to built-in intent name. It is possible to use this function to create built-in intents but utterances are required argument and you need to specify full built-in intent name f.e. `AMAZON.StopIntent`. See `{@link app.builtInIntent}`. If not specified (null, undefined or empty string), automatically generated intent name is used but we recommend to name each intent
     * @param {(string|string[])} richUtterances - one or more utterances. Utterances contain utterance description with slots types. Example: `My age is {age:Number}`
     * @param {function} handler - Function to be called when intent is invoked
     */
    app.intent = (name, richUtterances, handler) => {
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
    app.builtInIntent = (name, utterances, handler) => {
        // Validate built-in intent name
        if (!builtInIntentsMap[name]) {
            throw new Error(`Built-in Intent name ${name} is invalid. Please use one of: ${builtInIntentsList}`);
        }
        // Shift ommited arguments (utternaces are optional)
        if (!handler) {
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
    app.handle = (request, done) => handleRequest(app, request, handlers, done);
    /**
     * Creates custom slot
     * @param {string} name - Name of the custom slot
     * @param {string[]} samples - Array of custom slot samples
     */
    app.customSlot = (name, samples) => {
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
    app.action = (action) => {
        app.actions.push({
            from: typeof (action.from) === 'string' ? action.from : action.from.name,
            to: typeof (action.to) === 'string' ? action.to : action.to.name,
            //NOTE - what about pass or done ?
            if: action.if,
            fail: action.fail
        });
    };
    /**
     * Generates speech assets object: {schema, utterances, customSlots}
     */
    app.speechAssets = () => generateSpeechAssets(app);
    return app;
};
module.exports = createApp;
