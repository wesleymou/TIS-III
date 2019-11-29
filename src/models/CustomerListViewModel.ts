import Customer from "./Customer";
import { CustomerViewModel, createCustomerViewModel } from "./CustomerViewModel";
import { ViewModel } from "./ViewModel";

class CustomerListViewModel extends ViewModel {
  customers: Array<CustomerViewModel>;
  constructor(customers: Array<Customer>) {
    super()
    this.customers = customers.map(customer => createCustomerViewModel(customer));
  }
}

export default CustomerListViewModel;
