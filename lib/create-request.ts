'use strict';
import _ = require('lodash');
import RequestType = require('./data/request-type')

/**
 * Creates simple Alexa request
 */
const requestBuilder = (requestType: string, intent: {}, isNew: boolean, attrs: {}, appId: string) => {
//NOTE - interfaces

    const request = {
        session: {
            attributes: attrs || {},
            sessionId: 'SessionId.357a6s7',
            application: {
                applicationId: appId || 'amzn1.echo-sdk-123456'
            },
            user: {
                userId: 'amzn1.account.abc123'
            },
            new: isNew || false
        },
        request: {
            type: requestType,
            requestId: 'EdwRequestId.abc123456',
            timestamp: '2016-06-16T14:38:46Z',
            intent: intent
        }
    };

    return request;
};

/**
 * Creates LaunchRequest
 * @param {Object} attrs - Session attributes
 * @param {String} [appId] - Application id
 */
const launchRequest = (attrs: {}, appId: string) =>
    requestBuilder(RequestType.Launch, null, true, attrs, appId);

/**
 * Creates SessionEndedRequest
 * @param {Object} attrs - Session attributes
 * @param {String} [appId] - Application id
 */
const sessionEndedRequest = (attrs: {}, appId: string) =>
    requestBuilder(RequestType.SessionEnd, null, false, attrs, appId);

/**
 * Creates IntentRequest
 * @param {String} name - Name of the intent to be invoked
 * @param {Object} [slots] - Slots in simplified key:value schema. Defaults to {}
 * @param {Object} [attrs] - Session attributes. Defaults to {}
 * @param {boolean} [isNew] - Whether session is new. Defaults to false
 * @param {String} [appId] - Application id
 */
const intentRequest = (name: string, slots: {}, attrs: {}, isNew: boolean, appId: string) => {

    // Transform slots from minimal schema into slot schema sent by Amazon
    const transformedSlots = _.transform(slots, (result, key, value) => {
        result[key] = {
            name: value,
            value: key
        };
    }, {});

    return requestBuilder(RequestType.Intent, {
        name: name,
        slots: (slots) ? transformedSlots : undefined
    }, isNew, attrs, appId);
};

export = {
    launchRequest: launchRequest,
    sessionEndedRequest: sessionEndedRequest,
    intentRequest: intentRequest
};
