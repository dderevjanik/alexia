/**
 * Create new app
 * @param {string} name - App name
 * @param {Object} [options] - Additional app options
 * @param {string} [options.version] - App version
 * @param {string[]} [options.ids] - Array of app ids. Only requests with supported app ids will be handled
 */
declare const createApp: (name: any, options: any) => {
    name: any;
    options: any;
    intents: {};
    customSlots: {};
    actions: any[];
};
export = createApp;
