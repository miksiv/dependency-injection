import {ConsoleLogger} from "../dependencies/Logger";
import {Greeter} from "../Greeter";

class Token<T> {
    constructor(
        public readonly name: string,
        public readonly factory?: () => T // Optional factory function
    ) {
    }
}

// Create a dependency container
class DependencyContainer {
    private readonly dependencies = new Map<Token<any>, any>();

    register<T>(token: Token<T>, implementation?: T): void {
        if (token.factory) {
            this.dependencies.set(token, token.factory());
        } else {
            if (implementation) {
                this.dependencies.set(token, implementation);
            } else {
                throw new Error(`No factory or class provided for token "${token.name}".`);
            }
        }
    }

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

//Register the new Token
const loggerToken = new Token<ConsoleLogger>('Logger', () => new ConsoleLogger());

// Register the dependency implementation with the container
container.register(loggerToken);

// Inject the dependency into the greeter class
const greeter = new Greeter(container.get(loggerToken));
greeter.greet('John Doe');