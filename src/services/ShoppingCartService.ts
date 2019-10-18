import CrudAsync from '../models/CrudAsync';
import Database from './Database';

class ShoppingCartService implements CrudAsync<any> {
    createAsync(obj: any): Promise<void> {
        throw new Error("Method not implemented.");
    }    getByIdAsync(id: number): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getPageAsync(page: number): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    getAllAsync(): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    updateAsync(update: any): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeAsync(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }


}

export default ShoppingCartService;