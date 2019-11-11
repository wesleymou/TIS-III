$(function () {
  resetPaymentDate();

  $('#product-search-input').keypress((e) => {
    if (e.key === 'Enter') {
      $('.btn-search').click();
    }
  });

  $('.btn-search').click(() => {
    const query = $('#product-search-input').val();

    if (query) {
      searchProducts(query);
    }
  });

  //Adiciona itens da lista para o carrinho. Se o produto já foi adicionado, mostra um alert
  $(document).on('click', '.list-group-item-action', function () {
    let exists = false;
    let skus = $(".product-sku");

    const id = $(this).find(".hd-id").html();

    for (let i = 0; i < skus.length; i++) {
      if (skus[i].innerHTML == id) {
        alert("Produto já adicionado");
        return;
      }
    }

    const name = $(this).find("h4").html();
    const priceFormat = $(this).find("h5").html();
    const price = $(this).find("h5").data('price');

    $("#card-itens").append(`
        <div class="d-flex justify-content-between align-items-center mb-3 bg-list px-3 py-2 sale-item">
            <small class="text-black-50">#${id}</small>
            <span>${name}</span>
            <input type="number" class="form-control product-quantity" value=1 style="width: 80px">
            <span class="product-price" data-price="${price}">${priceFormat}</span>
            <i class="oi oi-trash remove-product" style="cursor: pointer"></i>
            <span class="product-sku" hidden>${id}</span>
        </div>
    `);

    $(".product-quantity").change(() => atualizarValores());
  });

  // Ao mudar a quantidade de produtos
  $(document).on('change', '.product-quantity', function () {
    const value = Number($(this).val()) || 0;
    if (value <= 0) {
      const $item = $(this).closest('.sale-item');
      $item.remove();
      atualizarValores();
    }
  });

  // Ao clicar no botão de remover produto do carrinho (lixeira)
  $(document).on('click', '.remove-product', function () {
    const $item = $(this).closest('.sale-item');
    $item.remove();
    atualizarValores();
  });

  // Altera o valor total e o parcial ao mudar a quantidade de itens
  $(".product-quantity").change(() => atualizarValores());

  // Clica no botão de pesquisar ao apertar a tecla Enter
  $('#customer-search-input').keypress(function (e) {
    if (e.key === 'Enter') {
      $('.btn-search-customer').click();
    }
  });

  // Ações ao pesquisar um cliente
  $('.btn-search-customer').click(function () {
    const query = $('#customer-search-input').val();

    const $helper = $('.customer-list-helper');

    $helper.html('Pesquisando...');

    if (query) {
      $.get('/customer/search?q=' + query)
        .then((results) => {

          // adicionando clientes à lista
          const $list = $('#customer-list');

          const items = results.map(customer => `
            <tr class="customer-list-item" data-id="${customer.id}" data-name="${customer.fullName}">
              <td>${customer.fullName} <span class="text-black-50">${customer.nickname}</span></td>
            </tr>
          `);

          $list.html(items);

          // atualizando o checkbox de usuário anônimo
          const $anonCheck = $('#anonymous-user-checkbox');

          if (results.length) {
            // desmarca anônimo 
            $helper.html('Clique no nome do cliente para selecionar:');

            $anonCheck
              .prop('disabled', false);

          } else {
            // marca anônimo se não veio nenhum resultado
            $helper.html('Nenhum cliente foi encontrado com os termos pesquisados.');

            $anonCheck
              .prop('disabled', true)
              .prop('checked', true);

            resetPaymentDate();
          }

          // limpa o input de id de cliente
          $('#customerId').val('');
        })
        .catch(() => $helper.html('Ocorreu um erro :('));
    }
  });

  // Ações ao selecionar um cliente na lista
  $(document).on('click', '.customer-list-item', function () {
    const customerId = $(this).data('id');
    const customerName = $(this).data('name');

    $('#paymentDate')
      .prop('disabled', false);

    $('.customer-list-item').removeClass('table-primary');
    $(this).addClass('table-primary');

    $('#customer-name').html(customerName);
    $('#customerId').val(customerId);

    $('#anonymous-user-checkbox').prop('checked', false);
  });

  // Ações ao clicar no checkbox de usuário anônimo
  $('#anonymous-user-checkbox').change(function () {
    if (this.checked) {
      resetPaymentDate();
      $('.customer-list-item').removeClass('table-primary');
      $('#customer-name').html('Anônimo')
      $('#customerId').val('');
    }
  });

  //Altera o valor total ao mudar o valor do desconto
  $("#discount").change(atualizarValores);

  // Clique no botão de registrar venda
  $("#finalize").click(function () {
    const cart = getSaleInfo();

    console.log(cart);

    if (cart.items.length) {
      $.post("/shopping-cart", cart, 'application/json')
        .then(() => {
          alert('Venda cadastrada com sucesso!');
          window.location.assign('/shopping-cart');
        })
        .catch(err => {
          alert('Ocorreu um erro :(');
        });
    } else {
      alert("Nenhum produto adicionado");
    }
  });
});

/**
 * Altera o valor total e o parcial na interface
 */
function atualizarValores() {
  const info = getSaleInfo();
  const { sum, total } = info;
  $("#partial-value").html(formatMoney(sum));
  $("#total-value").html(formatMoney(total));
}

/**
 * Formata um número para o tipo moeda (Real) na cultura pt-br
 * @param {number} num Valor a ser formatado
 */
function formatMoney(num) {
  return Number(num).toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL'
  });
}

/**
 * Retorna as informações da venda
 */
function getSaleInfo() {
  const items = $('.sale-item').map((i, item) => {
    const price = $(item).find('.product-price').data('price');
    const quantity = Number($(item).find('.product-quantity').val());
    const skuId = Number($(item).find('.product-sku').html());
    return { price, quantity, skuId };
  }).get();

  const paymentDate = $('#paymentDate').val();
  const paymentMethodId = Number($('#paymentMethod').val());
  const customerId = Number($('#customerId').val());

  const prices = items.map(item => item.price * item.quantity);
  const sum = prices.reduce((p, n) => p + n, 0);
  const discount = Number($("#discount").val()) || 0;
  const ratio = 1 - Math.abs(discount / 100);
  const total = ratio >= 0 ? sum * ratio : 0;

  return { items, prices, sum, discount, ratio, total, paymentDate, paymentMethodId, customerId };
}

/**
 * Busca os produtos e desenha as opções na interface
 * @param {string} query string de busca
 */
function searchProducts(query) {
  const $results = $('.results');
  $results.html('Buscando...');

  $.getJSON('/shopping-cart/' + query)
    .then((result) => renderProducts(result))
    .catch(() => $results.html('Ocorreu um erro :('));
}

/**
 * Renderiza na os produtos de acordo com o resultado da busca
 * @param {{products: any[]}} arg0 resultados da busca 
 */
function renderProducts({ products }) {
  const $results = $('.results');
  if (products && products.length) {
    const $list = $('<ul class="list-group product-list"></ul>');

    const listItems = products.map(product => {
      const { id, name, price, description, priceFormat, expirationDateFormat } = product;

      const $element = $(`
        <div class="list-group-item list-group-item-action bg-list my-3" style="cursor: pointer">
          <span class="hd-id" hidden>${id}</span>
          <div class="rounded">
              <div class="d-flex justify-content-between">
                  <h4><small class="text-black-50">#${id}</small> ${name}</h4>
                  <h5 data-price=${price}>${priceFormat}</h5>
              </div>
              <div class="d-flex justify-content-between">
                  <p>${description}</p>
                  <small>Validade: ${expirationDateFormat || 'N/D'}</small>
              </div>
          </div>
        </div>`);
      return $element;
    });

    $list.append(listItems);
    $results.html($list);
  } else {
    $results.html('Nada encontrado...');
  }
}

/**
 * Reseta e bloqueia o input de data de pagamento
 */
function resetPaymentDate() {
  const now = new Date().toLocaleDateString('pt-br');
  const dateParts = now.split('/');

  $('#paymentDate')
    .prop('disabled', true)
    .val(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
}
