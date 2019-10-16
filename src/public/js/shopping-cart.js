$(function () {
    //Adiciona itens da lista para o carrinho. Se o produto já foi adicionado, mostra um alert
    $('.list-group-item-action').click(function () {
        let exists = false;
        let skus = $('.product-sku');

        for (let i = 0; i < skus.length; i++) {
            if (skus[i].innerHTML == $(this).find('span').html()) {
                alert("Produto já adicionado");
                return;
            }
        }

        $('#card-itens').append(`
            <div class="d-flex justify-content-between mb-3 bg-list px-3 py-2" id="cart-itens">
                <span>${$(this).find('h4').html()}</span>
                <input type="number" class="form-control product-quantity" value=1 style="width: 50px">
                <span class="product-price">${$(this).find('h5').html()}</span>
                <span class="product-sku" hidden>${$(this).find('span').html()}</span>
            </div>
        `);
    });

    //Altera o valor parcial e o valor total ao adicionar itens no carrinho
    $('#card-itens').bind("DOMSubtreeModified", function () {
        let soma = 0;
        let itens = $('.product-price');
        for (let i = 0; i < itens.length; i++) {
            soma += parseFloat(itens[i].innerHTML);
        }
        $('#partial-value').html(soma * 1, 0);
        $('#total-value').html(soma - $('#discount').val() * 1, 0);
    });

    //Altera o valor total ao mudar o valor do desconto
    $('#discount').change(function () {
        $('#total-value').html(parseFloat($('#partial-value').html()).toFixed(2) - $('#discount').val() * 1, 0);
    });

    //Altera o valor total e o parcial ao mudar a quantidade de itens
    $('.product-quantity').change(function () {
        let soma = 0;
        let itens = $('.product-price');
        for (let i = 0; i < itens.length; i++) {
            soma += parseFloat(itens[i].innerHTML);
        }
        $('#partial-value').html(soma * 1, 0);
        $('#total-value').html(soma - $('#discount').val() * 1, 0);
    });
});