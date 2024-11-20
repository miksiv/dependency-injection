// Define an interface for the dependency
export interface Logger {
    log(message: string): void;
}

// Create a concrete implementation of the dependency
export class ConsoleLogger implements Logger {
    log(message: string): void {
        console.log(message);
    }
}