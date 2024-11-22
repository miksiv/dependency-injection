import {ConsoleLogger} from "../dependencies/Logger";
import {Greeter} from "../Greeter";
import {Token} from "./Token";

class DependencyContainer {
    private readonly dependencies = new Map<Token<any>, any>();
    // A reference to a parent DI container
    private readonly parentContainer?: DependencyContainer;

    constructor(parentContainer?: DependencyContainer) {
        this.parentContainer = parentContainer;
    }

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
        if (dependency) {
            return dependency as T;
        } else if (this.parentContainer) {
            return this.parentContainer.get(token);
        }
        throw new Error(`Dependency "${token}" not registered`);
    }
}

//Create a parent container
const parentContainer = new DependencyContainer();

//create a child container
const childContainer = new DependencyContainer(parentContainer);

//Register the new Token in parent container
const parentRegisteredToken = new Token<ConsoleLogger>('Logger', () => new ConsoleLogger());
parentContainer.register(parentRegisteredToken);

// Inject the dependency into the greeter class
const greeter = new Greeter(childContainer.get(parentRegisteredToken));
greeter.greet('John Doe');