import CrudAsync from "../models/CrudAsync";
import Sale from "../models/Sale";
import Database, { multipleStatementConnection } from "./Database";
import SaleDetail from "../models/SaleDetail";

class SaleService implements CrudAsync<Sale> {
  createAsync(sale: Sale): Promise<void> {
    const connection = multipleStatementConnection();

    const itemsInsertQuery = sale.items
      .map(
        item => `
          insert into sale_item (sale_id, sku_id, name, description, date_expires, price, price_sold, quantity)
          select @sale_id, id, name, description, date_expires, price, ${item.priceSold}, ${item.quantity}
          from sku
          where sku.id = ${item.skuId};
        `
      )
      .join("");

    const paymentDateParts = (sale.paymentDate || new Date())
      .toLocaleDateString()
      .split('/');

    const [month, date, year] = paymentDateParts;
    const paymentDate = [year, month, date].join('-');

    const sql = `
      insert into sale (
          customer_id,
          user_id,
          discount,
          total_price,
          sale_status_id,
          payment_date,
          payment_method_id
      )
      values (
          ${sale.customerId}, 
          1, 
          ${sale.discount}, 
          ${sale.totalPrice}, 
          ${sale.saleStatus}, 
          cast('${paymentDate}' as datetime), 
          ${sale.paymentMethodId}
      );
      set @sale_id = LAST_INSERT_ID();

      ${itemsInsertQuery}

      update sku s
      inner join sale_item i on i.sku_id = s.id
      set quantity_available = (s.quantity_available - i.quantity)
      where i.sale_id = @sale_id;
    `;

    return new Promise((resolve, reject) => {
      connection.query(sql, (error, results) => {
        if (!error) {
          resolve();
        } else {
          reject(error);
        }
      });
    });
  }

  getByIdAsync(id: number): Promise<Sale> {
    throw new Error("Method not implemented.");
  }
  getPageAsync(page: number): Promise<Sale[]> {
    throw new Error("Method not implemented.");
  }
  getAllAsync(): Promise<SaleDetail[]> {
    const sql = `
      SELECT s.id, ifnull(c.nickname, c.fullname) as customer_name, s.sale_status_id, s.date_created, payment_date, s.discount, s.total_price
      FROM sale s 
      INNER JOIN customer c 
      ON c.id = s.customer_id
      `;
    return new Promise((resolve, reject) => {
      Database.query(sql, (error, results) => {
        if (!error) {
          resolve(results.map(mapRowToSaleDetail));
        } else {
          reject(error);
        }
      });
    });
  }

  updateAsync(update: Sale): Promise<void> {
    throw new Error("Method not implemented.");
  }
  removeAsync(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

function mapRowToSaleDetail(row: any): SaleDetail {
  return Object.assign(new SaleDetail(), {
    id: row["id"],
    CustomerName: row["customer_name"],
    saleStatus: row["sale_status_id"],
    dateCreated: row["date_created"],
    datePayment: row["payment_date"],
    discount: row["discount"],
    totalPrice: row["total_price"]
  });
}

export default SaleService;
