'use strict';
const _ = require('lodash');
const expect = require('chai').expect;
const alexia = require('../');
const app = require('./test-apps/basic-app');
const createRequest = require('../dist/create-request');

const intentNames = Object.keys(app.intents);
const intents = _.values(app.intents);

describe('basic app handler', () => {

    let attrs;

    it('should handle LaunchRequest', (done) => {
        const request = createRequest.launchRequest(null, 'appId1');
        app.handle(request, (response => {
            expect(response).to.be.defined;
            done();
        }));
    });

    it('should handle SessionEndedRequest', (done) => {
        const request = createRequest.sessionEndedRequest(null, 'appId1');
        app.handle(request, (response => {
            expect(response).to.be.defined;
            done();
        }));
    });

    it('should handle custom LaunchRequest', (done) => {
        const app2 = alexia.createApp('TestApp1');
        app2.onStart(() => 'foo');
        app2.handle(createRequest.launchRequest(), (response) => {
            expect(response).to.be.defined;
            expect(response.response.outputSpeech.text).to.equal('foo');
            done();
        });
    });

    it('should handle custom SessionEndedRequest', (done) => {
        const app2 = alexia.createApp('TestApp2');
        app2.onEnd(() => 'bar');
        app2.handle(createRequest.sessionEndedRequest(), (response) => {
            expect(response).to.be.defined;
            expect(response.response.outputSpeech.text).to.equal('bar');
            done();
        });
    });

    it('should handle FirstIntent request', (done) => {
        const request = createRequest.intentRequest('FirstIntent', null, null, false, 'appId1');

        // Remove empty session attributes to cover scenario when missing
        request.session.attributes = undefined;

        const expectedResponse = {
            version: '1.2.3',
            sessionAttributes: {previousIntent: 'FirstIntent'},
            response: {
                outputSpeech: {type: 'PlainText', text: 'All good'},
                shouldEndSession: false
            }
        };

        app.handle(request, (response) => {
            expect(response).to.be.defined;
            expect(response).to.deep.equal(expectedResponse);
            done();
        });
    });

    it('should handle intent with slots', (done) => {
        const request = createRequest.intentRequest(intents[5].name, {name:'Borimir'}, null, false, 'appId1');

        app.handle(request, (response) => {
            expect(response.response.outputSpeech.text).equal('okay sir your name is Borimir');
            done();
        });
    });

    it('should handle IntentA request', (done) => {
       const request = createRequest.intentRequest('IntentA', null, null, false, 'appId1');

       app.handle(request, (response) => {
           attrs = response.sessionAttributes;
           expect(attrs).to.deep.equal({yes:true});
           expect(response.response.outputSpeech).to.deep.equal({type:'SSML', ssml:'<speak>Hi</speak>'});
           expect(response.response.reprompt).to.deep.equal({outputSpeech: {type:'SSML', ssml:'<speak>Sup</speak>'}});
           done();
       });
    });

    it('should handle IntentB request', (done) => {
        const request = createRequest.intentRequest('IntentB', null, attrs, false, 'appId1');

        app.handle(request, (response) => {
            attrs = response.sessionAttributes;
            expect(attrs).to.deep.equal({yes:true, previousIntent:'IntentB'});
            expect(response.response.outputSpeech).to.deep.equal({type:'PlainText', text:'attribute value is true'});
            done();
        });
    });

    it('should handle async intent', (done) => {
        const request = createRequest.intentRequest(intents[11].name, null, null, false, 'appId1');

        app.handle(request, (response) => {
            expect(response.response.outputSpeech.text).equal('I just did stuff asynchronously. Thank you for this opportunity');
            done();
        });
    });

    it('should not handle request for wrong app id', () => {
        const app2 = alexia.createApp('App2', {ids: 'supported-app-id'});
        try {
            app2.handle(createRequest.launchRequest(null, 'wrong-app-id'));
            throw new Error('App was handled with unsupported application id');
        } catch(e) {
            expect(e.message).to.equal('Application id is not valid');
        }
    });

    it('should not handle unsupported intent', () => {
        const request = createRequest.intentRequest('UnsupportedIntentName', null, null, false, 'appId1');
        try {
            app.handle(request);
        } catch(e) {
            expect(e.message).to.equal('Unsupported intent: \'UnsupportedIntentName\'');
        }
    });

    it('should not handle unsupported request', () => {
        const request = createRequest.intentRequest('IntentA', null, null, false, 'appId1');
        request.request.type = 'UnsupportedRequestType';
        try {
            app.handle(request);
        } catch(e) {
            expect(e.message).to.equal('Unsupported request: \'UnsupportedRequestType\'');
        }
    });

    it('should not redefine custom slots', () => {
        try {
            const app2 = alexia.createApp('App2');
            app2.customSlot('MyCustomSlot', []);
            app2.customSlot('MyCustomSlot', []); // redefine
            throw new Error('App was handled with custom slot redefinition');
        } catch(e) {
            expect(e.message).to.equal('Slot with name MyCustomSlot is already defined');
        }
    });

    it('should not redefine built-in slots', () => {
        const app2 = alexia.createApp('App2');
        try {
            app2.customSlot('Number', []);
            throw new Error('App was handled with custom slot redefinition');
        } catch(e) {
            expect(e.message).to.equal('Slot with name Number is already defined in built-in slots.');
        }

        try {
            app2.customSlot('AMAZON.NUMBER', []);
            throw new Error('App was handled with custom slot redefinition');
        } catch(e) {
            expect(e.message).to.equal('Slot with name AMAZON.NUMBER is already defined in built-in slots.');
        }
    });

    it('should not create intent with invalid utterances', () => {
        try {
            const app2 = alexia.createApp('App2');
            app2.intent('MegaIntent', 'Not good* utterance *-#$%^&*', () => 'Nope')
            throw new Error('App was handled with invalid intent utterance');
        } catch(e) {
            expect(e.message).to.equal('Error: Sample utterance: \'Not good* utterance *-#$%^&*\' is not valid. Each sample utterance must consist only of alphabet characters, spaces, dots, hyphens, brackets and single quotes');
        }
    });

    it('should not create intent with invalid name', () => {
        try {
            const app2 = alexia.createApp('App2');
            app2.intent('Mega -.- Intent o/', 'Hi', () => 'Nope bye')
            throw new Error('App was handled with invalid intent name');
        } catch(e) {
            expect(e.message).to.equal('Intent name Mega -.- Intent o/ is invalid. Only lowercase and uppercase letters are allowed');
        }
    });

    it('should not create built-in intent invalid name', () => {
        try {
            const app2 = alexia.createApp('App2');
            app2.builtInIntent('InvalidBuiltInIntent', 'stop pls', () => 'hi');
            throw new Error('App was handled with invalid Built-in Intent name');
        } catch(e) {
            expect(e.message).to.equal('Built-in Intent name InvalidBuiltInIntent is invalid. Please use one of: cancel, help, next, no, pause, previous, repeat, resume, startOver, stop, yes');
        }
    });

    it('should not create custom slot with invalid name', () => {
        try {
            const app2 = alexia.createApp('App2');
            app2.customSlot('Mega -.- CustomSlot /-', []);
            throw new Error('App was handled with invalid custom slot name');
        } catch(e) {
            expect(e.message).to.equal('Custom slot name Mega -.- CustomSlot /- is invalid. Only lowercase and uppercase letters are allowed');
        }
    });

    it('should not create custom slot with invalid sample utterance', () => {
        try {
            const app2 = alexia.createApp('App2');
            app2.customSlot('MyCustomSlot', ['Nope ***']);
            throw new Error('App was handled with invalid custom slot sample utterance');
        } catch(e) {
            expect(e.message).to.equal('Custom slot with name MyCustomSlot contains invalid sample utterance: Nope ***');
        }
    });

});
