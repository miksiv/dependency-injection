import {ConsoleLogger, Logger} from "../dependencies/Logger";
import {Greeter} from "../Greeter";
import {Token} from "./Token";
import {RegisterOptions} from "../models/RegisterOptions";


class DependencyContainer {
    private readonly dependencies = new Map<Token<any>, any>();

    // Register dependencies with flexible options
    register<T>(token: Token<T>, options?: RegisterOptions<T>): void {
        if (options?.useValue) {
            // If a predefined value is provided, register it
            this.dependencies.set(token, options.useValue);
        } else if (options?.useFactory) {
            // If a factory is provided, run function and register it
            this.dependencies.set(token, options.useFactory());
        } else if (options?.useClass) {
            // If a class is provided, create a new instance of it and register
            this.dependencies.set(token, new options.useClass!());
        } else {
            // Fallback to token's default factory
            if (token.factory) {
                this.dependencies.set(token, token.factory());
            } else {
                throw new Error(`No factory or class provided for token "${token.name}".`);
            }
        }
    }

    // Retrieve dependencies by token
    get<T>(token: Token<T>): T {
        const dependency = this.dependencies.get(token);
        if (!dependency) {
            throw new Error(`Dependency "${token.name}" not registered`);
        }
        return dependency as T;
    }
}

// Create an instance of the dependency container
const container = new DependencyContainer();

//Register the new Token for future registration of its' provider with custom options
const loggerToken = new Token<ConsoleLogger>('Logger', () => new ConsoleLogger());

class ConsoleError implements Logger {
    log(message: string) {
        console.error(message);
    }
}

// Register the dependency implementation with the container
// container.register(loggerToken, {
//     useFactory: () => ({
//         log(message: string) {
//             console.error(message);
//         }
//     })
// });

// Register the dependency implementation with the container
container.register(loggerToken, {
    useClass: ConsoleError
});

// Register the dependency implementation with the container
// container.register(loggerToken, {
//     useValue: {
//         log: (message: string) => {
//             console.error(message);
//         }
//     }
// });

// Inject the dependency into the greeter class
const greeter = new Greeter(container.get(loggerToken));
greeter.greet('John Doe');