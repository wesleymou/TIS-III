import SaleItem from "./SaleItem";
import NumberUtil from "../utils/NumberUtil";
import DateUtil from "../utils/DateTimeUtil";

type SaleItemViewModel = SaleItem & {
  expirationDateFormat: string;
  priceFormat: string;
  priceSoldFormat: string;
};

function createSaleItemViewModel(saleItem: SaleItem): SaleItemViewModel {
  let view: SaleItemViewModel = {
    ...saleItem,
    expirationDateFormat: DateUtil.formatDate(saleItem.expirationDate),
    priceFormat: NumberUtil.formatMoney(saleItem.price),
    priceSoldFormat: NumberUtil.formatMoney(saleItem.priceSold)
  };
  return view;
}

export { createSaleItemViewModel };
export default SaleItemViewModel;
