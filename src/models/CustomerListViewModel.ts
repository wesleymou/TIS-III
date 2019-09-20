import Customer from "./Customer";
import { CustomerViewModel, createCustomerViewModel } from "./CustomerViewModel";

class CustomerListViewModel {
  customers: Array<CustomerViewModel>;
  constructor(customers: Array<Customer>) {
    this.customers = customers.map(customer => createCustomerViewModel(customer));
  }
}

export default CustomerListViewModel;
