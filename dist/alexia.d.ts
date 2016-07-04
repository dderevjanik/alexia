declare var _default: {
    createApp: (name: any, options: any) => {
        name: any;
        options: any;
        intents: {};
        customSlots: {};
        actions: any[];
    };
    createLaunchRequest: (attrs: any, appId: any) => {
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
    createSessionEndedRequest: (attrs: any, appId: any) => {
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
    createIntentRequest: (name: any, slots: any, attrs: any, isNew: any, appId: any) => {
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
