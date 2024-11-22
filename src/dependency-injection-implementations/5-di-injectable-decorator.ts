import {Logger} from "../dependencies/Logger";
import {Greeter} from "../Greeter";
import {RegisterOptions} from "../models/RegisterOptions";
import {Class} from "../models/UtilityTypes";
import {Token} from "./Token";

class DependencyContainer {
    private readonly dependencies = new Map<Token<any>, any>();
    private readonly classNames = new Map<string, Token<any>>();


    register<T>(token: Token<T>, options?: RegisterOptions<T>): void {
        if (options?.useValue) {
            this.dependencies.set(token, options.useValue);
        } else if (options?.useFactory) {
            this.dependencies.set(token, options.useFactory());
        } else if (options?.useClass) {
            this.dependencies.set(token, new options.useClass!());
        } else {
            if (token.factory) {
                this.dependencies.set(token, token.factory());
            } else {
                throw new Error(`No factory or class provided for token "${token.name}".`);
            }
        }
        // Store the class name in classNames map for easy lookup by class name
        this.classNames.set(token.name, token);
    }

    // Retrieve dependencies by token
    get<T>(token: Token<T>): T {
        const dependency = this.dependencies.get(token);
        if (!dependency) {
            throw new Error(`Dependency "${token.name}" not registered`);
        }
        return dependency as T;
    }

    // Retrieve a dependency by class name (using token lookup)
    getByClass<T>(dependencyClass: Class): T {
        const token = this.classNames.get(dependencyClass.name);
        if (!token) {
            throw new Error(`Class "${dependencyClass.name}" not registered`);
        }
        return this.get(token);
    }
}

//New DI container is created on a bootstrap
const container = new DependencyContainer();

// A TS decorator function to automatically inject a provider
function Injectable(): ClassDecorator {
    return function (target: Function) {
        // Register the class with the provided token in the DependencyContainer
        container.register(new Token(target.name), {
            useClass: target as Class
        });
    };
}


//Class is marked as injectable and injected into the DI container
@Injectable()
class ConsoleWarn implements Logger {
    log(message: string) {
        console.warn(message);
    }
}

//Dependency is served by a DI system without a manual registration of a provider in DI container
const greeter = new Greeter(container.getByClass(ConsoleWarn));
greeter.greet('John Doe');