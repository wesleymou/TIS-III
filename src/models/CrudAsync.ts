export default interface CrudAsync<T> {
    createAsync(obj: T): Promise<void>;
    getByIdAsync(id: number): Promise<T>;
    getPageAsync(page: number): Promise<Array<T>>;
    getAllAsync(): Promise<Array<T>>;
    updateAsync(update: any): Promise<void>;
    removeAsync(id: number): Promise<void>;
}
