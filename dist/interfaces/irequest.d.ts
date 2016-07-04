import IResponse = require('./iresponse');
interface IRequest {
    version: string;
    sessionAttributes: {
        [name: string]: string;
    };
    response: IResponse;
}
export = IRequest;
