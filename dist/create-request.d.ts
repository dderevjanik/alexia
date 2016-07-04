declare var _default: {
    launchRequest: (attrs: {}, appId: string) => {
        session: {
            attributes: {};
            sessionId: string;
            application: {
                applicationId: string;
            };
            user: {
                userId: string;
            };
            new: boolean;
        };
        request: {
            type: string;
            requestId: string;
            timestamp: string;
            intent: {};
        };
    };
    sessionEndedRequest: (attrs: {}, appId: string) => {
        session: {
            attributes: {};
            sessionId: string;
            application: {
                applicationId: string;
            };
            user: {
                userId: string;
            };
            new: boolean;
        };
        request: {
            type: string;
            requestId: string;
            timestamp: string;
            intent: {};
        };
    };
    intentRequest: (name: string, slots: {}, attrs: {}, isNew: boolean, appId: string) => {
        session: {
            attributes: {};
            sessionId: string;
            application: {
                applicationId: string;
            };
            user: {
                userId: string;
            };
            new: boolean;
        };
        request: {
            type: string;
            requestId: string;
            timestamp: string;
            intent: {};
        };
    };
};
export = _default;
