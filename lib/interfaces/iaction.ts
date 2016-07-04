interface IAction {
    from: string|{name: string}, //NOTE - looks creepy
    to: string|{name: string};  //NOTE - looks creepy
    if: (slots, attrs) => void;
    fail: (slots, attrs) => void;
};

export = IAction;
