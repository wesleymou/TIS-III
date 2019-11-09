import Customer from "./Customer";
import DateTimeUtil from "../utils/DateTimeUtil";

export type CustomerViewModel = Customer | {
  dateCreatedFormat?: string;
}

export function createCustomerViewModel(customer: Customer): CustomerViewModel {
  return {
    ...customer,
    dateCreatedFormat: DateTimeUtil.formatDateTime(customer.dateCreated)
  }
};

export default CustomerViewModel;