import IAppOptions = require('./iapp-options');

interface IApp {
    name: string;
    options: IAppOptions;
    intents: any;
    customSlots: any;
    actions: any[];
    onStart: (handler: any) => void;
    onEnd: (handler: any) => void;
    defaultActionFail: (handler: any) => void;
    intent: (name: string, richUtterances: string|string[], handler: any) => void;
    builtInIntent: (name: string, utterances: string|string[], handler: any) => void;
    handle: (request: any, done: any) => void;
    customSlot: (name: string, samples: string[]) => void;
    action: (action: any) => void;
    speechAssets: () => void;
};

export = IApp;
