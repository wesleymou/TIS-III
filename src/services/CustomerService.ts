import CrudAsync from "../models/CrudAsync";
import Customer from "../models/Customer";
import Database from './Database';

const anonId = process.env.ANON_ID || 2;

class CustomerService implements CrudAsync<Customer> {
  createAsync(customer: Customer): Promise<void> {
    const sql = `insert into customer(fullname, nickname, phone, email, address)
        values(?, ?, ?, ?, ?)`;

    return new Promise((resolve: Function, reject: Function) => {
      Database.query(sql, [
        customer.fullName,
        customer.nickname,
        customer.phone,
        customer.email,
        customer.address
      ])
        .on('end', () => resolve())
        .on('error', e => reject(e))
    });
  }

  getByIdAsync(id: number): Promise<Customer> {
    const sql = 'select * from customer where id = ?';

    return new Promise((resolve: Function, reject: Function) => {
      Database.query(sql, id, (err, results: any[]) => {
        if (!err) {
          const [customer] = results.map(mapRowToCustomer);
          resolve(customer);
        } else {
          reject(err);
        }
      });
    });
  }

  getPageAsync(page: number): Promise<Customer[]> {
    throw new Error("Method not implemented.");
  }

  getAllAsync(): Promise<Customer[]> {
    const sql = 'select * from customer where active = 1';

    return new Promise((resolve: Function, reject: Function) => {
      Database.query(sql, (err: Error, results: any[]) => {
        if (!err) {
          const customers = results.map(mapRowToCustomer);
          resolve(customers);
        } else {
          reject(err);
        }
      });
    });
  }

  searchAsync(query: string): Promise<Customer[]> {
    const escaped = Database.escape('%' + query + '%');
    const sql = `select * from customer 
      where (fullname like ${escaped} or nickname like ${escaped})
      and id <> ${anonId}
      and active = 1;`

    return new Promise((resolve: Function, reject: Function) => {
      Database.query(sql, (err: Error, results: any[]) => {
        if (!err) {
          const customers = results.map(mapRowToCustomer);
          resolve(customers);
        } else {
          reject(err);
        }
      });
    });
  }

  updateAsync(update: any): Promise<void> {
    throw new Error("Method not implemented.");
  }

  updateWithIdAsync(id: number, update: any): Promise<void> {
    const sql = `update customer set ? where id = ${id}`;
    return new Promise((resolve: Function, reject: Function) => {
      Database.query(sql, update)
        .on('end', () => resolve())
        .on('error', e => reject(e));
    });
  }

  removeAsync(id: number): Promise<void> {
    const sql = `update customer set active = 0 where id = ?`;
    return new Promise((resolve: Function, reject: Function) => {
      Database.query(sql, id)
        .on('end', () => resolve())
        .on('error', e => reject(e));
    });
  }
}

function mapRowToCustomer(row: any): Customer {
  return {
    id: row['id'] || 0,
    fullName: row['fullname'] || '',
    nickname: row['nickname'] || '',
    address: row['address'] || '',
    phone: row['phone'] || '',
    email: row['email'] || '',
    dateCreated: row['date_created']
  }
}

export default CustomerService;
