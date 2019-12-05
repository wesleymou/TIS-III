import CrudAsync from "../models/CrudAsync";
import Sale from "../models/Sale";
import Database, { multipleStatementConnection } from "./Database";
import SaleDetail from "../models/SaleDetail";
import { resolve } from "dns";
import { rejects } from "assert";
import DateTimeUtil from "../utils/DateTimeUtil";

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
      .split("/");

    const [month, date, year] = paymentDateParts;
    const paymentDate = [year, month, date].join("-");

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
        connection.end();
      });
    });
  }

  getByIdAsync(id: number): Promise<SaleDetail> {
    const sql = `
      SELECT s.*, ifnull(c.nickname, c.fullname) as customer_name
      FROM sale s 
      INNER JOIN customer c 
      ON c.id = s.customer_id
      WHERE s.id = ?
      `;
    return new Promise((resolve, reject) => {
      Database.query(sql, id, (error, results) => {
        if (!error) {
          const [first] = results;
          resolve(mapRowToSaleDetail(first));
        } else {
          reject(error);
        }
      });
    });
  }
  getPageAsync(page: number): Promise<Sale[]> {
    throw new Error("Method not implemented.");
  }
  getAllAsync(): Promise<SaleDetail[]> {
    const sql = `
      SELECT s.*, ifnull(c.nickname, c.fullname) as customer_name
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
    var datePayment = DateTimeUtil.formatDateTimeDB(update.datePayment);

    const sql = `UPDATE sale
    SET payment_method_id=${update.paymentMethodId},sale_status_id=${update.saleStatus},payment_date=cast('${datePayment}' as datetime),customer_id=${update.customerId}
    WHERE id=${update.id} AND sale_status_id!=2`;

    return new Promise((resolve, rejects) => {
      Database.query(sql, (err, results) => {
        if (!err) resolve();
        else rejects(err);
      });
    });
  }

  updateConfirmAsync(id: number): Promise<void> {
    const sql = `UPDATE sale
    SET sale_status_id=3
    WHERE id=? AND sale_status_id!=2`;
    return new Promise((resolve, rejects) => {
      Database.query(sql, id, (err, res) => {
        if (!err) resolve(res);
        else rejects(err);
      });
    });
  }

  updateCancelAsync(id: number): Promise<void> {
    const sql = `UPDATE sku s
    INNER JOIN sale_item si
    ON si.sku_id=s.id
    INNER JOIN sale
    ON sale.id=si.sale_id
    SET s.quantity_purchased=(s.quantity_purchased-si.quantity), s.quantity_available=(s.quantity_available+si.quantity)
    WHERE si.sale_id=${id} AND sale.sale_status_id!=2;
    
    UPDATE sale s
    SET s.sale_status_id=2
    WHERE s.id=${id} AND s.sale_status_id!=2;`;

    return new Promise((resolve, rejects) => {
      Database.query(sql, (err, res) => {
        if (!err) resolve(res);
        else rejects(err);
      });
    });
  }

  removeAsync(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

function mapRowToSaleDetail(row: any): SaleDetail {
  return Object.assign(new SaleDetail(), {
    id: row["id"],
    CustomerName: row["customer_name"],
    customerId: row["customer_id"],
    userId: row["user_id"],
    saleStatus: row["sale_status_id"],
    dateCreated: row["date_created"],
    datePayment: row["payment_date"],
    discount: row["discount"],
    totalPrice: row["total_price"],
    paymentMethodId: row["payment_method_id"]
  });
}

export default SaleService;
