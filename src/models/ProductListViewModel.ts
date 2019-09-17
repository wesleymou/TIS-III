import Product from "./Product";
import ProductViewModel, { createViewModel } from "./ProductViewModel";

class ProductListViewModel {
    products: Array<ProductViewModel>;
    constructor(products: Array<Product>) {
        this.products = products.map(product => createViewModel(product));
    }
}

export default ProductListViewModel;
