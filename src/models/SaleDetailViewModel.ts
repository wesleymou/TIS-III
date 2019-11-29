import SaleDetail from "./SaleDetail";
import NumberUtil from "../utils/NumberUtil";
import DateUtil from "../utils/DateTimeUtil";
import { PaymentMethod, getAllPaymentMethods } from "./PaymentMethodViewModel";
import { StatusClasses, getAllSaleStatus } from "./SaleStatusViewModel";

type SaleDetailViewModel = SaleDetail & {
  dateCreatedFormat: string;
  datePaymentFormat: string;
  totalWithoutDiscont: string;
  discountFormated: string;
  totalPriceFormated: string;
  statusFormat: StatusClasses;
  paymentMethodFormat: PaymentMethod;
};

function createSaleDetailViewModel(
  saleDetail: SaleDetail
): SaleDetailViewModel {
  if (
    saleDetail.saleStatus == 1 &&
    saleDetail.datePayment &&
    saleDetail.datePayment.valueOf() < Date.now()
  ) {
    saleDetail.saleStatus = 4;
  }

  let viewModel: SaleDetailViewModel = {
    ...saleDetail,
    dateCreatedFormat: DateUtil.formatDateTime(saleDetail.dateCreated),
    datePaymentFormat: DateUtil.formatDateTime(saleDetail.datePayment),
    totalWithoutDiscont: NumberUtil.formatMoney(
      saleDetail.totalPrice * (1 + saleDetail.discount)
    ),
    discountFormated: `${100 * saleDetail.discount}%`,
    totalPriceFormated: NumberUtil.formatMoney(saleDetail.totalPrice),
    statusFormat: getAllSaleStatus()[saleDetail.saleStatus],
    paymentMethodFormat: getAllPaymentMethods()[saleDetail.paymentMethodId]
  };
  return viewModel;
}

export { createSaleDetailViewModel };
export default SaleDetailViewModel;
