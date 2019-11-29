import { ViewModel } from "./ViewModel";
import Product from "./Product";

export default class SKUListViewModel extends ViewModel {
    product?: Product;
    skus: Product[] = [];
}
