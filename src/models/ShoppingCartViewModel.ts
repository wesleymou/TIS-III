import { ViewModel } from "./ViewModel";
import { PaymentMethod } from "./PaymentMethodViewModel";

export default class ShoppingCartViewModel extends ViewModel {
    paymentMethods: PaymentMethod[] = []
}