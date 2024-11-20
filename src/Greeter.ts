// Create a class that requires the dependency
import {Logger} from "./dependencies/Logger";

export class Greeter {
    private readonly logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    greet(name: string): void {
        this.logger.log(`Hello, ${name}!`);
    }
}