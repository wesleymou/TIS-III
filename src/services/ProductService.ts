import Product from '../models/Product';
import Database from './Database'
import CrudAsync from '../models/CrudAsync';

class ProductService implements CrudAsync<Product> {
  createAsync(product: Product): Promise<void> {
    return new Promise((resolve: Function, reject: Function) => {
      Database.query(
        `insert into product (name, code, description, price, date_expires, quantity)
         values (?, ?, ?, ?, ?, ?)`, [
        product.name,
        product.code,
        product.description,
        product.price,
        product.expirationDate,
        product.quantityAvailable
      ])
        .on('error', err => reject(err))
        .on('end', () => resolve())
    });
  }

  getByIdAsync(id: number): Promise<Product> {
    throw new Error('Method not implemented.');
  }

  getPageAsync(page: number): Promise<Product[]> {
    throw new Error('Method not implemented.');
  }

  getAllAsync(): Promise<Product[]> {
    return new Promise((resolve: Function, reject: Function) => {
      Database.query(`select * from product`, (err: Error, results: any[]) => {
        if (!err) {
          const products = results.map(mapRowToProduct);
          resolve(products)
        } else {
          reject(err);
        }
      });
    });
  }

  searchAsync(query: string): Promise<Product[]> {
    return new Promise((resolve: Function, reject: Function) => {
      const escaped = Database.escape('%' + query + '%');
      const sql = `select * from product where name like ${escaped};`

      Database.query(sql, query, (err: Error | null, results: any[]) => {
        if (!err) {
          const products = results.map(mapRowToProduct);
          resolve(products);
        } else {
          reject(err);
        }
      });
    });
  }

  updateAsync(update: Product): Promise<void> {
    throw new Error('Method not implemented.');
  }

  removeAsync(id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

function mapRowToProduct(row: any): Product {
  return {
    id: row['id'] || 0,
    code: row['code'] || '',
    dateCreated: row['date_created'],
    expirationDate: row['date_expires'],
    description: row['description'] || '',
    name: row['name'] || '',
    price: row['price'] || 0,
    quantityAvailable: row['quantity'] || 0
  }
}

export default ProductService;
