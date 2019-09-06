export default interface ICrudAsync<T> {
    createAsync(obj: T): Promise<void>;
    getByIdAsync(id: number): Promise<T>;
    getAllAsync(): Promise<Array<T>>;
    updateAsync(update: T): Promise<void>;
    removeAsync(id: number): Promise<void>;
}