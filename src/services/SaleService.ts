import CrudAsync from "../models/CrudAsync";
import Sale from "../models/Sale";
import { multipleStatementConnection } from './Database'

class SaleService implements CrudAsync<Sale> {
    createAsync(sale: Sale): Promise<void> {
        const connection = multipleStatementConnection();

        const itemsInsertQuery = sale.items.map(item => `
            insert into sale_item (sale_id, sku_id, name, description, date_expires, price, price_sold, quantity)
            select @sale_id, id, name, description, date_expires, price, ${item.priceSold}, ${item.quantity}
            from sku
            where sku.id = ${item.skuId};
        `).join('');

        const sql = `
            insert into sale (customer_id, user_id, discount, total_price, sale_status)
            values (2, 1, ${sale.discount}, ${sale.totalPrice}, 1);
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
    getAllAsync(): Promise<Sale[]> {
        throw new Error("Method not implemented.");
    }
    updateAsync(update: Sale): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeAsync(id: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
}


export default SaleService