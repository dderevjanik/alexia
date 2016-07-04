/**
 * Creates custom slot. Checks if custom slot name is not conflicting with amazon built in slots
 * @param {Object} customSlots - Map of custom slot names to custom slots
 * @param {string} name - Name of the custom slot
 * @param {string[]} samples - Array of custom slot samples
 */
declare const createCustomSlot: (customSlots: any, name: any, samples: any) => {
    name: any;
    samples: any;
};
export = createCustomSlot;
