interface IAction {
    from: string | {
        name: string;
    };
    to: string | {
        name: string;
    };
    if: Function;
    fail: Function;
}
export = IAction;
