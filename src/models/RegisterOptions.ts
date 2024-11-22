import {Factory} from "./UtilityTypes";

export interface RegisterOptions<T> {
    useClass?: new (...args: any[]) => T; // Class to instantiate
    useFactory?: Factory<T>; // Custom factory function
    useValue?: T; // Predefined instance
}