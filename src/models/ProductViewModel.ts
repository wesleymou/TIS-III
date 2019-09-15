import Product from "./Product";

class ProductViewModel {
    product: Product;
    priceMoney: string;

    constructor(product: Product) {
        this.product = product;
        this.priceMoney = product.price.toLocaleString('pt-br', { 
            style: 'currency', 
            currency: 'BRL' 
        });
    }
}

export default ProductViewModel;
