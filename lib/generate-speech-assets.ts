'use strict';
import _ = require('lodash');
import ISpeechAssets = require('./interfaces/ispeech-assets');

/**
 * Creates stringified part of speechAssets
 * @param {string} type
 * @param {object} data
 * @returns {string}
 */
const createAsset = (type: string, data) => `${type}:\n${data}\n\n`;

/**
 * @param {object} assets
 * @param {object} assets.intentSchema
 * @param {object} assets.utterances
 * @param {object} assets.customSlots
 * @returns {function} returning stringified version of speech assetsuseful for printing in terminal
 */
const createStringifyAssets = (assets) => () => {
    const customSlotsString = _.map(assets.customSlots, (samples, name) => {
        return `${name}:\n${samples.join('\n')}\n`;
    }).join('\n');

    return createAsset('intentSchema', assets.intentSchema) +
        createAsset('utterances', assets.utterances) +
        createAsset('customSlots', customSlotsString);
};

/**
 * Generates intent schema JSON string
 * @return {string} strigified intent schema object generated from intents
 */
const genIntentSchema = (intents) => {
    const intentSchema = {
        intents: []
    };

    _.forOwn(intents, intent => {
        const currentSchema = {
            intent: intent.name
        };

        // Property slots is optional
        if(intent.slots && intent.slots.length > 0) {
            currentSchema.slots = intent.slots;
        }

        intentSchema.intents.push(currentSchema);
    });

    return JSON.stringify(intentSchema, null, 2);
};

/**
 * Generates sample utterances tied to intent name
 * @return {string} interpretation of all sample utterances
 */
const genUtterances = (intents) => {
    const sampleUtterances = [];

    _.forOwn(intents, intent => {
        intent.utterances.forEach(utterance => {
            if(utterance) {
                sampleUtterances.push(`${intent.name} ${utterance}`);
            }
        });
    });

    return sampleUtterances.join('\n');
};

/**
 * @return {object} where key = slot type and value is string interpretation of
 * custom slot type samples
 */
const genCustomSlots = (customSlots) => {
    const allCustomSlotSamples = {};

    _.forOwn(customSlots, (customSlot) => {
        allCustomSlotSamples[customSlot.name] = customSlot.samples;
    });

    return allCustomSlotSamples;
};

const generateSpeech = (app): ISpeechAssets => {
    const assets = {
        intentSchema: genIntentSchema(app.intents),
        utterances: genUtterances(app.intents),
        customSlots: genCustomSlots(app.customSlots)
    };

    assets.toString = createStringifyAssets(assets);

    return assets;
};

export = generateSpeech;
