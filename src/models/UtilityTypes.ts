export type Factory<T> = () => T;
export type Class = { new(...args: any[]): any; };
