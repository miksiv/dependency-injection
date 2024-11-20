import {ConsoleLogger} from "../dependencies/Logger";
import {Greeter} from "../Greeter";

// Create a dependency container
class DependencyContainer {
    private readonly dependencies = new Map<string, any>();

    register<T>(interfaceName: string, implementation: T): void {
        this.dependencies.set(interfaceName, implementation);
    }

    get<T>(interfaceName: string): T {
        const dependency = this.dependencies.get(interfaceName);
        if (!dependency) {
            throw new Error(`Dependency "${interfaceName}" not registered`);
        }
        return dependency as T;
    }
}

// Create an instance of the dependency container
const container = new DependencyContainer();

// Register the dependency implementation with the container
container.register('Logger', new ConsoleLogger());


// Inject the dependency into the greeter class
const greeter = new Greeter(container.get('Logger'));
greeter.greet('John Doe');