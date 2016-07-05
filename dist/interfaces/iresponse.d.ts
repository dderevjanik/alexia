import IOutputSpeech = require('./ioutputspeech');
interface IResponse {
    version: string;
    sessionAtributes: any;
    response: {
        card: any;
        outputSpeech: IOutputSpeech;
        reprompt: any;
        shouldEndSession: boolean;
    };
}
export = IResponse;
