'use strict';
import createApp = require('./create-app');
import createRequest = require('./create-request');

export = {
    createApp: createApp,
    createLaunchRequest: createRequest.launchRequest,
    createSessionEndedRequest: createRequest.sessionEndedRequest,
    createIntentRequest: createRequest.intentRequest,
};
