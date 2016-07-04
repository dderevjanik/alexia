interface IResponse {
    outputSpeech: {
        type: string;
        text: string;
    };
    shouldEndSession: boolean;
};

export = IResponse;
