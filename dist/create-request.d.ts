declare var _default: {
    launchRequest: (attrs: any, appId: any) => {
        session: {
            attributes: any;
            sessionId: string;
            application: {
                applicationId: any;
            };
            user: {
                userId: string;
            };
            new: any;
        };
        request: {
            type: any;
            requestId: string;
            timestamp: string;
            intent: any;
        };
    };
    sessionEndedRequest: (attrs: any, appId: any) => {
        session: {
            attributes: any;
            sessionId: string;
            application: {
                applicationId: any;
            };
            user: {
                userId: string;
            };
            new: any;
        };
        request: {
            type: any;
            requestId: string;
            timestamp: string;
            intent: any;
        };
    };
    intentRequest: (name: any, slots: any, attrs: any, isNew: any, appId: any) => {
        session: {
            attributes: any;
            sessionId: string;
            application: {
                applicationId: any;
            };
            user: {
                userId: string;
            };
            new: any;
        };
        request: {
            type: any;
            requestId: string;
            timestamp: string;
            intent: any;
        };
    };
};
export = _default;
