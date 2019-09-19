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
    throw new Error("Method not implemented.");
  }
  updateAsync(update: Customer): Promise<void> {
    throw new Error("Method not implemented.");
  }
  removeAsync(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}



export default CustomerService;