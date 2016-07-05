interface IAction {
    from: string | {
        name: string;
    };
    to: string | {
        name: string;
    };
    if: (slots, attrs) => void;
    fail: (slots, attrs) => void;
}
export = IAction;
