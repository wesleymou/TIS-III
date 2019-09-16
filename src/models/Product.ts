class Product {
    id: number = 0;
    code: string = '';
    name: string = '';
    description: string = '';
    price: number = 0;
    dateCreated: Date = new Date();
    expirationDate: Date = new Date();
    quantityAvailable: number = 0;
}

export default Product;