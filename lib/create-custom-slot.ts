'use strict';
import _ = require('lodash');
import builtInSlotsMap = require('./data/built-in-slots-map');
import validator = require('./validator');

const builtInSlotsValues: string[] = _.values(builtInSlotsMap);

/**
 * Creates custom slot. Checks if custom slot name is not conflicting with amazon built in slots
 * @param {Object} customSlots - Map of custom slot names to custom slots
 * @param {string} name - Name of the custom slot
 * @param {string[]} samples - Array of custom slot samples
 */
const createCustomSlot = (customSlots, name: string, samples: string[]) => {

    if(customSlots[name]) {
        throw new Error(`Slot with name ${name} is already defined`);
    }

    if(builtInSlotsMap[name] || builtInSlotsValues.indexOf(name) !== -1) {
        throw new Error(`Slot with name ${name} is already defined in built-in slots.`);
    }

    if(!validator.isNameValid(name)) {
        throw Error(`Custom slot name ${name} is invalid. Only lowercase and uppercase letters are allowed`);
    }

    samples.forEach(sample => {
        if(!validator.isUtteranceValid(sample)) {
            throw new Error(`Custom slot with name ${name} contains invalid sample utterance: ${sample}`);
        }
    });

    return {
        name,
        samples
    };
};

export = createCustomSlot;
