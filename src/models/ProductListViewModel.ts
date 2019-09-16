import Product from "./Product";
import ProductViewModel from "./ProductViewModel";

class ProductListViewModel {
    products: Array<ProductViewModel>;
    constructor(products: Array<Product>) {
        this.products = products.map(product => new ProductViewModel(product));
    }
}

export default ProductListViewModel;