import Product from "../models/Product";
import conn from './Database'
import ICrudAsync from "../models/ICrudAsync";

class ProductService implements ICrudAsync<Product> {
    createAsync(product: Product): Promise<void> {
        return new Promise((resolve: Function, reject: Function) => {
            conn.query(
                `insert into products (
                    code, name, description, 
                    price, datecreated, expirationdate, 
                    quantityavailable)
                values (?, ?, ?, ?, ?, ?);`,
                product)
                .on('end', () => resolve())
                .on('error', err => reject(err));
        });
    }

    getByIdAsync(id: number): Promise<Product> {
        return new Promise((resolve: Function, reject: Function) => {
            conn.query(`select * from products where id = ?`, id)
                .on('result', (row: Product) => resolve(row))
                .on('error', err => reject(err));
        });
    }
    getAllAsync(): Promise<Product[]> {
        return new Promise((resolve: Function, reject: Function) => {
            conn.query(`select * from products`)
                .on('fields', (results: Product[]) => resolve(results))
                .on('error', err => reject(err));
        });
    }
    updateAsync(update: Product): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeAsync(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

export default ProductService;