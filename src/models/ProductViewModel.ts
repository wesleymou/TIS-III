import Product from "./Product";
import NumberUtil from "../utils/NumberUtil";
import DateTimeUtil from "../utils/DateTimeUtil";

class ProductViewModel extends Product {
    priceFormat: string;
    dateCreatedFormat: string;
    expirationDateFormat: string;

    constructor(product: Product) {
        super();
        Object.assign(this, product);
        this.priceFormat = NumberUtil.formatMoney(product.price);
        this.dateCreatedFormat = DateTimeUtil.formatDateTime(product.dateCreated);
        this.expirationDateFormat = DateTimeUtil.formatDate(product.expirationDate);
    }
}

export default ProductViewModel;
