import ISlot = require('./islot');
interface IIntent {
    intent: string;
    slots?: ISlot[];
}
export = IIntent;
