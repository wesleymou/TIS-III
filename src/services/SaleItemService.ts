import CrudAsync from "../models/CrudAsync";
import SaleItem from "../models/SaleItem";
import Database from "./Database";

class SaleItemService implements CrudAsync<SaleItem> {
  createAsync(obj: SaleItem): Promise<void> {
    throw new Error("Method not implemented.");
  }

  getByIdAsync(id: number): Promise<SaleItem> {
    throw new Error("Method not implemented.");
  }

  getAllByIdAsync(id: number): Promise<SaleItem[]> {
    const sql = `
      SELECT * FROM sale_item as si 
      WHERE si.sale_id = ?`;

    return new Promise((resolve, reject) => {
      Database.query(sql, [id], (error, results) => {
        if (!error) {
          resolve(results.map(mapRowToSaleItem));
        } else {
          reject(error);
        }
      });
    });
  }

  getPageAsync(page: number): Promise<SaleItem[]> {
    throw new Error("Method not implemented.");
  }
  getAllAsync(): Promise<SaleItem[]> {
    throw new Error("Method not implemented.");
  }
  updateAsync(update: any): Promise<void> {
    throw new Error("Method not implemented.");
  }
  removeAsync(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

function mapRowToSaleItem(row: any): SaleItem {
  return Object.assign(new SaleItem(), {
    id: row["id"],
    skuId: row["sku_id"],
    saleId: row["sale_id"],
    name: row["name"],
    description: row["description"],
    expirationDate: row["date_expires"],
    quantity: row["quantity"],
    price: row["price"],
    priceSold: row["price_sold"]
  });
}

export default SaleItemService;
