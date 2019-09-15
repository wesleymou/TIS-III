export default interface Crud<T> {
    create(obj: T): void;
    getById(id: number): T;
    getAll(): Array<T>;
    update(update: T): void;
    remove(id: number): void;
}
