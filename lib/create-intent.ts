'use strict';
import _ = require('lodash');
import bases = require('bases');
import builtInSlotsMap = require('./data/built-in-slots-map');
import builtInIntentsMap = require('./data/built-in-intents-map');
import validator = require('./validator');

//NOTE - jsdoc
const generateIntentName = (intents) => {
    let position = 0;
    let generatedName;

    // While generated name is not already used and generatedName is not built-in intent (just in case)
    while(intents[(generatedName = bases.toBase52(position++))] && !builtInIntentsMap[generatedName]);

    return generatedName;
};

//NOTE - jsdoc
const findUtteranceMatches = (utterance) => {
  // Example: for 'move forward by {value:Number}' we get:
  // [[ '{value:Number}', 'value', 'Number', index: 16, input: 'move forward by {value:Number}' ]]
  const myregex = /{(.*?):(.*?)\}/gmi;
  const allMatches = [];

  let result;
  while((result = myregex.exec(utterance)) !== null) {
      allMatches.push(result);
  }

  return allMatches;
};

//NOTE - jsdoc
const transformSlotType = (type) => {
    const transformedType = builtInSlotsMap[type];
    return transformedType ? transformedType : type;
};

//NOTE - jsdoc
const parseRichUtterances = (richUtterances: string[], slots, utterances) => {
    // Iterate over each rich utterance and transform it by removing slots description
    _.each(richUtterances, function(utterance) {
        const matches = findUtteranceMatches(utterance);

        _.each(matches, function(match) {

            // Remember slot type
            slots.push({
                name: match[1],
                type: transformSlotType(match[2])
            });

            // Replace utterance slot type (there could be multiple slots in utterance)
            utterance = utterance.replace(match[0], '{' + match[1] + '}');
        });

        if(validator.isUtteranceValid(utterance)) {
            // Remember utterance
            utterances.push(utterance);
        } else {
            throw new Error(`Error: Sample utterance: '${utterance}' is not valid. Each sample utterance must consist only of alphabet characters, spaces, dots, hyphens, brackets and single quotes`);
        }

    });
};

/**
 * Creates intent
 * @param {Object[]} intents - Array of intents. Required for determining taken intent names
 * @param {string} name - Name of the intent. If null or undefined, automatically generated intent name is used
 * @param {(string|string[])} richUtterances - Utterance or array of rich utterances
 * @param {function} handler - Function to be called when intent is invoked
 */
const createIntent = (intents, name: string, richUtterances: string | string[], handler) => {
    // Convert utterances to array
    const arrRichUtterances = <string[]> (_.isArray(richUtterances) ? richUtterances : [richUtterances]);

    // If intent name is not specified, try to generate unique one
    if(!name) {
        name = generateIntentName(intents);

    } else if(!validator.isNameValid(name)) {
        throw Error(`Intent name ${name} is invalid. Only lowercase and uppercase letters are allowed`);

    } else if(builtInIntentsMap[name]) {
        // If built-in intent name was used map intent name to it
        name = builtInIntentsMap[name];
    }

    // Transformed slots and utterances from richUtterances
    const slots = [];
    const utterances = [];

    parseRichUtterances(arrRichUtterances, slots, utterances);

    return {
        name: name,
        slots: slots,
        utterances: utterances,
        handler: handler
    };
};

export = createIntent;
