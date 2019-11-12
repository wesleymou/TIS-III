import SaleItem from "./SaleItem";

class Sale {
    id = 0;
    customerId = 0;
    userId = 0;
    totalPrice = 0;
    discount = 0;
    paymentMethodId = 0;
    paymentDate?: Date;
    dateCreated?: Date;
    dateUpdated?: Date;
    saleStatus = 0;
    items: SaleItem[] = [];
}

export default Sale;
