import CrudAsync from "../models/CrudAsync";
import SKU from "../models/SKU";

class SKUService implements CrudAsync<SKU> {
    createAsync(obj: SKU): Promise<void> {
        throw new Error("Method not implemented.");
    }    getByIdAsync(id: number): Promise<SKU> {
        throw new Error("Method not implemented.");
    }
    getPageAsync(page: number): Promise<SKU[]> {
        throw new Error("Method not implemented.");
    }
    getAllAsync(): Promise<SKU[]> {
        throw new Error("Method not implemented.");
    }
    updateAsync(update: SKU): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeAsync(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }   
}

export default SKUService;