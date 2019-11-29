import Product from "./Product";
import ProductViewModel, { createViewModel } from "./ProductViewModel";
import { ViewModel } from "./ViewModel";

class ProductListViewModel extends ViewModel {
    products: Array<ProductViewModel>;
    constructor(products: Array<Product>) {
        super();
        this.products = products.map(product => createViewModel(product));
    }
}

export default ProductListViewModel;
