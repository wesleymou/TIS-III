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

export function mapRowToProduct(row: any): Product {
    return {
        id: row['id'] || 0,
        code: row['code'] || '',
        dateCreated: row['date_created'],
        expirationDate: row['date_expires'],
        description: row['description'] || '',
        name: row['name'] || '',
        price: row['price'] || 0,
        quantityAvailable: row['quantity_available'] || 0
    }
}

export default Product;
