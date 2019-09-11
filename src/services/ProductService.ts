import Product from "../models/Product";
import conn from './Database'
import CrudAsync from "../models/CrudAsync";

class ProductService implements CrudAsync<Product> {

    createAsync(product: Product): Promise<void> {
        return new Promise((resolve: Function, reject: Function) => {
            conn
                .query(
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
            conn.query(`select * from products`, (err:Error, results: Product[]) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results)
                }
            });
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
