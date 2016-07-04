/**
 * Creates intent
 * @param {Object[]} intents - Array of intents. Required for determining taken intent names
 * @param {string} name - Name of the intent. If null or undefined, automatically generated intent name is used
 * @param {(string|string[])} richUtterances - Utterance or array of rich utterances
 * @param {function} handler - Function to be called when intent is invoked
 */
declare const createIntent: (intents: any, name: string, richUtterances: string | string[], handler: any) => {
    name: string;
    slots: any[];
    utterances: any[];
    handler: any;
};
export = createIntent;
