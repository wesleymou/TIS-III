import Database, { multipleStatementConnection } from './Database';
import Product, { mapRowToProduct } from '../models/Product';
import Customer, { mapRowToCustomer } from "../models/Customer";

export default class DashboardService {
    /**
     * Conta quantos clientes e produtos estão cadastrados
     * e quantas vendas já foram faturadas
     */
    getCounters(): Promise<any> {
        const sql = `
            set @customers = (
                select count(*)
                from customer
                where active = 1
            );

            set @sales = (
                select count(*)
                from sale
                where sale_status_id = 3
            );

            set @products = (
                select sum(sku.quantity_available)
                from sku
                inner join product on sku.product_id = product.id
                where sku.active = 1
                and product.active = 1
            );

            select 
                @customers as customers,
                @sales as sales,
                @products as products;
        `;

        return new Promise((resolve, reject) => {
            const connection = multipleStatementConnection();

            connection.query(sql, (error, results: any[]) => {
                if (error) {
                    reject(error);
                } else {
                    const [result] = results[results.length - 1];
                    resolve(result);
                }

                connection.end();
            });
        });
    }

    /**
     * Seleciona os produtos que venceram ou 
     * vão vencer dentro de 30 dias
     */
    getExpiringProducts(): Promise<Product[]> {
        const sql = `
            select * from sku
            where active = 1
            and date_expires < DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 DAY)
            order by date_expires, product_id
        `;

        return new Promise((resolve, reject) => {
            Database.query(sql, (error, results: any[]) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.map(mapRowToProduct));
                }
            })
        });
    }

    getOverdueCustomers(): Promise<Customer[]> {
        const sql = `
            select 
                c.*,
                sum(s.total_price) as debit,
                min(s.payment_date) as overdue_since
            from sale s
            inner join customer c on c.id = s.customer_id
            where c.active = 1
            and c.id <> 2
            and s.payment_date < CURRENT_TIMESTAMP
            and s.sale_status_id in (1, 4)
            group by c.id
        `;

        return new Promise((resolve, reject) => {
            Database.query(sql, (error, results: any[]) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.map(mapRowToCustomer));
                }
            })
        });
    }

    getFutureIncome() {
        const sql = `
            select 
                ifnull(c.nickname, c.fullname) as name,
                s.total_price as total,
                s.payment_date as date
            from sale s
            inner join customer c on c.id = s.customer_id
            where s.payment_date > CURRENT_DATE;
        `;

        return new Promise((resolve, reject) => {
            Database.query(sql, (error, results: any[]) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            })
        });
    }

}