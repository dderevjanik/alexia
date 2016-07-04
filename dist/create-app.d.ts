import IAppOptions = require('./interfaces/iapp-options');
/**
 * Create new app
 * @param {string} name - App name
 * @param {Object} [options] - Additional app options
 * @param {string} [options.version] - App version
 * @param {string[]} [options.ids] - Array of app ids. Only requests with supported app ids will be handled
 */
declare const createApp: (name: string, options: IAppOptions) => {
    name: string;
    options: IAppOptions;
    intents: {};
    customSlots: {};
    actions: any[];
    onStart: (handler: () => string) => any;
    onEnd: (handler: () => string) => any;
    defaultActionFail: (handler: () => string) => any;
    intent: (name: string, richUtterances: string | string[], handler: () => void) => any;
    builtInIntent: (name: string, utterances: string | string[], handler: () => void) => any;
    handle: (request: any, done: () => void) => any;
    customSlot: (name: string, samples: string[]) => any;
    action: (action: any) => any;
    speechAssets: () => any;
};
export = createApp;
