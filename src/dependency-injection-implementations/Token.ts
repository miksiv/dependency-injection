export class Token<T> {
    constructor(
        public readonly name: string,
        public readonly factory?: () => T // Optional factory function
    ) {
    }
}