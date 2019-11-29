class SaleItem {
    id: number = 0;
    skuId: number = 0;
    saleId: number = 0;
    name: string = '';
    description: string = '';
    expirationDate?: Date;
    quantity: number = 0;
    price: number = 0;
    priceSold: number = 0;
}

export default SaleItem;