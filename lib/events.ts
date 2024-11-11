export const balanceUpdateEvent = new EventTarget();

export const emitBalanceUpdate = () => {
    balanceUpdateEvent.dispatchEvent(new Event('balanceUpdate'));
};