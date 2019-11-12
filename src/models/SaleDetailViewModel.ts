import SaleDetail from "./SaleDetail";
import NumberUtil from "../utils/NumberUtil";
import DateUtil from "../utils/DateTimeUtil";
import { stringify } from "querystring";
import { type } from "os";

type StatusClasses = {
  [n: number]: {
    name: string,
    className: string
  }
};

type SaleDetailViewModel = SaleDetail & {
  dateCreatedFormat: string,
  datePaymentFormat: string,
  totalWithoutDiscont: string,
  discountFormated: string,
  totalPriceFormated: string,
  statusFormat: StatusClasses
};

const statusClasses:StatusClasses = {
  1:{ 
     name: 'Pendente',
     className: 'badge badge-warning'
 },
   2: {
     name: 'Cancelada',
     className: 'badge badge-secundary'
   },
   3:{
     name: 'Finalizada',
     className: 'badge badge-success'
   },
   4: {
     name: 'Em atraso',
     className: 'badge badge-danger'
   }
 };

function createSaleDetailViewModel(saleDetail: SaleDetail): SaleDetailViewModel {

  if(saleDetail.datePayment && saleDetail.datePayment.valueOf() < Date.now()){
    saleDetail.saleStatus = 4;
  }

  let viewModel: SaleDetailViewModel = {
    ...saleDetail,
    dateCreatedFormat: DateUtil.formatDateTime(saleDetail.dateCreated),
    datePaymentFormat: DateUtil.formatDateTime(saleDetail.datePayment),
    totalWithoutDiscont: NumberUtil.formatMoney(saleDetail.totalPrice * (1 + saleDetail.discount)),
    discountFormated: `${100*saleDetail.discount}%`,
    totalPriceFormated: NumberUtil.formatMoney(saleDetail.totalPrice),
    statusFormat: statusClasses[saleDetail.saleStatus]
  };
  return viewModel;
}

export {createSaleDetailViewModel};
export default SaleDetailViewModel;
