import IIntentSchema = require('./iintent-schema');
interface ISpeechAssets {
    intentSchema: IIntentSchema;
    utterances: string;
    customSlots: {
        Name: string[];
    };
}
export = ISpeechAssets;
