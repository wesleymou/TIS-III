import Product from "./Product";
import DateTimeUtil from "../utils/DateTimeUtil";
import NumberUtil from "../utils/NumberUtil";

type ProductViewModel = Product & {
  priceFormat: string;
  dateCreatedFormat: string;
  expirationDateFormat: string;
};

function createViewModel(product: Product): ProductViewModel {
  let viewModel: ProductViewModel = {
    ...product,
    priceFormat: NumberUtil.formatMoney(product.price),
    dateCreatedFormat: DateTimeUtil.formatDateTime(product.dateCreated),
    expirationDateFormat: DateTimeUtil.formatDate(product.expirationDate),
  };
  return viewModel;
}

export { createViewModel };
export default ProductViewModel;
