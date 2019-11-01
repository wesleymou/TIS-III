import SKU from "../models/SKU";
import Database from "./Database";
import CrudAsync from "../models/CrudAsync";
import { resolve } from "path";
import { MysqlError } from "mysql";

class SKUService implements CrudAsync<SKU> {
  createAsync(sku: SKU): Promise<void> {
    return new Promise((resolve, reject) => {
      Database.query(
        `INSERT INTO sku (product_id, name, description, date_expires, quantity_purchased, quantity_available, price)
                SELECT id, name, description, ?, ?, ?, ?
                FROM product
                where id = ?
                and active = 1`,
        [
          sku.expirationDate,
          sku.quantityAvailable,
          sku.quantityAvailable,
          sku.price,
          sku.productId
        ],
        (err, results) => {
          if (err) {
            reject(err);
          } else if (!results.affectedRows) {
            reject(new Error("Nenhum produto encontrado com o id " + sku.id));
          } else {
            resolve();
          }
        }
      );
    });
  }

  getByIdAsync(id: number): Promise<SKU> {
    throw new Error("Method not implemented.");
  }
  getPageAsync(page: number): Promise<SKU[]> {
    throw new Error("Method not implemented.");
  }

  getAllAsync(): Promise<SKU[]> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * from sku WHERE quantity_available > 0 and active = 1`;

      Database.query(sql, (err: Error, result: any[]) => {
        if (!err) {
          const sku = result.map(mapRowToSku);
          resolve(sku);
        } else {
          reject(err);
        }
      });
    });
  }

  searchProductAsync(query: string): Promise<SKU[]> {
    return new Promise((resolve, reject) => {
      const escaped = Database.escape(`%${query}%`);

      const sql = `SELECT * from sku
        WHERE (id = ? OR name like ${escaped})
        AND quantity_available > 0
        and active = 1
        ORDER BY name, date_expires`;

      const id = Number(query) || 0;

      Database.query(sql, id, (err, result: any[]) => {
        if (!err) {
          const sku = result.map(mapRowToSku);
          resolve(sku);
        } else {
          reject(err);
        }
      });
    });
  }

  searchByIdAsync(ids: number[]): Promise<SKU[]> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * from sku WHERE id IN(${ids.join(',')});`;
      Database.query(sql, (err, results: any[]) => {
        if (!err) {
          const sku = results.map(mapRowToSku);
          resolve(sku);
        } else {
          reject(err);
        }
      });
    });
  }

  updateAsync(update: SKU): Promise<void> {
    throw new Error("Method not implemented.");
  }

  removeAsync(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      Database.query('update sku set active = 0 where id = ?', id)
        .on('end', () => resolve())
        .on('error', (err) => reject(err));
    });
  }

  getByProductAsync(productId: number): Promise<SKU[]> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT s.*, p.code
                from sku s
                INNER JOIN product p ON p.id = s.product_id
                WHERE p.id = ?
                and p.active = 1
                and s.active = 1
                ORDER BY s.id`;

      Database.query(sql, productId, (err, results: any[]) => {
        if (!err) {
          const skuList = results.map(mapRowToSku);
          resolve(skuList);
        } else {
          reject(err);
        }
      });
    });
  }
}

function mapRowToSku(row: any): SKU {
  return {
    id: row["id"],
    name: row["name"],
    code: row["code"],
    description: row["description"],
    price: row["price"],
    quantityAvailable: row["quantity_available"],
    quantityPurchased: row["quantity_purchased"],
    productId: row["product_id"],
    dateCreated: row["date_created"],
    expirationDate: row["date_expires"]
  };
}

export default SKUService;
