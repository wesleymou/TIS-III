import CrudAsync from "../models/CrudAsync";
import Customer from "../models/Customer";
import Database from './Database';

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
    throw new Error("Method not implemented.");
  }

  getPageAsync(page: number): Promise<Customer[]> {
    throw new Error("Method not implemented.");
  }

  getAllAsync(): Promise<Customer[]> {
    const sql = 'select * from customer';

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
    const sql = `select * from customer where fullname like ${escaped} or nickname like ${escaped};`

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

  updateAsync(update: Customer): Promise<void> {
    throw new Error("Method not implemented.");
  }
  removeAsync(id: number): Promise<void> {
    throw new Error("Method not implemented.");
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
