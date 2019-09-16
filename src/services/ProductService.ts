import Product from "../models/Product";
import Database from './Database'
import CrudAsync from "../models/CrudAsync";
import conn from './Database'

class ProductService implements CrudAsync<Product> {
    createAsync(product: Product): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getByIdAsync(id: number): Promise<Product> {
        throw new Error("Method not implemented.");
    }

    getPageAsync(page: number): Promise<Product[]> {
        throw new Error("Method not implemented.");
    }

    getAllAsync(): Promise<Product[]> {
        return new Promise((resolve: Function, reject: Function) => {
            conn.query(`select * from product`, (err: Error, results: any[]) => {
                if (!err) {
                    const products = new Array<Product>();

                    for (const row of results) {
                        products.push({
                            id: row['id'],
                            code: row['code'],
                            dateCreated: row['date_created'],
                            expirationDate: row['date_expires'],
                            description: row['description'],
                            name: row['name'],
                            price: row['price'],
                            quantityAvailable: row['quantity']
                        });
                    }

                    resolve(products)
                } else {
                    reject(err);
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
