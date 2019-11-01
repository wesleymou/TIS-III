$(function () {

  $('#product-search-input').keypress((e) => {
    if (e.key === 'Enter') {
      $('.btn-search').click();
    }
  })

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
        <div class="d-flex justify-content-between mb-3 bg-list px-3 py-2 sale-item">
            <span>${name}</span>
            <input type="number" class="form-control product-quantity" value=1 style="width: 50px">
            <span class="product-price" data-price="${price}">${priceFormat}</span>
            <span class="product-sku" hidden>${id}</span>
        </div>
    `);
    $(".product-quantity").change(() => atualizarValores());
  });

  //Altera o valor total e o parcial ao mudar a quantidade de itens
  $(".product-quantity").change(() => atualizarValores());

  //Altera o valor parcial e o valor total ao adicionar itens no carrinho
  $("#card-itens").bind("DOMSubtreeModified", () => atualizarValores());

  //Altera o valor total ao mudar o valor do desconto
  $("#discount").change(atualizarValores);

  $("#finalize").click(function () {
    const { items, discount } = getSaleInfo();
    if (items.length) {
      const cart = { items, discount };
      $.post("/shopping-cart", cart)
        .then(() => {
          alert('Venda cadastrada com sucesso!');
          window.location.assign(window.location.href);
        })
        .catch(err => alert('Erro: ' + err));
    } else {
      alert("Nenhum produto adicionado");
    }
  });
});

//Altera o valor total e o parcial
function atualizarValores() {
  const { sum, total } = getSaleInfo();
  $("#partial-value").html(formatMoney(sum));
  $("#total-value").html(formatMoney(total));
}

function formatMoney(num) {
  return Number(num).toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL'
  });
}

function getSaleInfo() {
  const items = $('.sale-item').map((i, item) => {
    const price = $(item).find('.product-price').data('price');
    const quantity = Number($(item).find('.product-quantity').val());
    const skuId = Number($(item).find('.product-sku').html());
    return { price, quantity, skuId };
  }).get();

  const prices = items.map(item => item.price * item.quantity);
  const sum = prices.reduce((p, n) => p + n, 0);
  const discount = Number($("#discount").val()) || 0;
  const ratio = 1 - Math.abs(discount / 100);
  const total = ratio >= 0 ? sum * ratio : 0;

  return { items, prices, sum, discount, ratio, total };
}

function searchProducts(query) {
  const $results = $('.results');
  $results.html('Buscando...');

  $.getJSON('/shopping-cart/' + query)
    .then((result) => renderProducts(result))
    .catch(() => $results.html('Ocorreu um erro :('));
}

function renderProducts({ products }) {
  const $results = $('.results');
  if (products && products.length) {
    const $list = $('<ul class="list-group product-list"></ul>');

    const listItems = products.map(product => {
      const { id, name, price, description, priceFormat, expirationDateFormat } = product;

      const $element = $(`
        <a href="#" class="list-group-item list-group-item-action bg-list my-3">
          <span class="hd-id" hidden>${id}</span>
          <div class="rounded">
              <div class="d-flex justify-content-between">
                  <h4>${name}</h4>
                  <h5 data-price=${price}>${priceFormat}</h5>
              </div>
              <div class="d-flex justify-content-between">
                  <p>${description}</p>
                  <small>Validade: ${expirationDateFormat || 'N/D'}</small>
              </div>
          </div>
        </a>`);
      return $element;
    });

    $list.append(listItems);
    $results.html($list);
  } else {
    $results.html('Nada encontrado...');
  }
}