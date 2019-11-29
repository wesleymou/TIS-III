class MenuItem {
    name: string = '';
    link: string = '';
    icon: string = '';
    active?: boolean = false;
}

export class ViewModel {

    title = 'Figaro - Barbershop Manager';

    menu: MenuItem[] = [{
        name: 'Dashboard',
        link: '/',
        icon: 'home'
    }, {
        name: 'Venda',
        link: '/shopping-cart',
        icon: 'calculator'
    }, {
        name: 'Rel. Financeiro',
        link: '/sales-history',
        icon: 'dollar'
    }, {
        name: 'Clientes',
        link: '/customer',
        icon: 'people'
    }, {
        name: 'Produtos',
        link: '/product',
        icon: 'basket'
    }];

    setActiveMenu = (url: string) => this.menu
        .forEach(item => item.active = item.link === url);
}