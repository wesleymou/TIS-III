import SKU from "./SKU";

class Product {
    id: number = 0;
    code: string = '';
    name: string = '';
    description: string = '';
    price: number = 0;
    quantityAvailable: number = 0;
    dateCreated?: Date;
    expirationDate?: Date;
    SKUList?: Array<SKU>;
};

export default Product;
