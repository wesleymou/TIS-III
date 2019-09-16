class NumberUtil {
    static formatMoney(num: number, decimalDigits: number = 2): string {
        const moneyFormat = new Intl.NumberFormat('pt-br', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: decimalDigits,
            maximumFractionDigits: decimalDigits
        })

        let result = moneyFormat.format(num).replace('R$', 'R$ ');
        return result;
    }
}

export default NumberUtil;