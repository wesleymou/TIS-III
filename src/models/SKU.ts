import Product from "./Product";

class SKU extends Product {
    productId: number = 0;
    quantityPurchased: number = 0;
    dateCreated?: Date;
    expirationDate?: Date;
}

export default SKU;