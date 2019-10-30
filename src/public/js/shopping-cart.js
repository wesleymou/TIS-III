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
    if (parseFloat($("#total-value").html()) != 0) {
      let cart = {
        products: [],
        discount: $("#discount").val(),
        total: $("#total-value").html()
      };

      for (let i = 0; i < $("#card-itens").find("div").length; i++) {
        let product = {
          sku: $("#card-itens")
            .find(`div:eq(${i})`)
            .find(".product-sku")
            .html(),
          price: $("#card-itens")
            .find(`div:eq(${i})`)
            .find(".product-price")
            .html(),
          quantity: $("#card-itens")
            .find(`div:eq(${i})`)
            .find(".product-quantity")
            .val()
        };
        cart.products.push(product);
      }

      $.post("/shopping-cart", cart);
    } else {
      alert("Nenhum produto adicionado");
    }
  });
});

//Altera o valor total e o parcial
function atualizarValores() {
  const prices = $('.sale-item').map((i, item) => {
    const price = $(item).find('.product-price').data('price');
    const quantity = $(item).find('.product-quantity').val();
    return price * quantity;
  }).get();

  const soma = prices.reduce((p, n) => p + n);
  const discount = $("#discount").val();
  const ratio = 1 - Math.abs(discount / 100);
  const total = ratio >= 0 ? soma * ratio : 0;

  $("#partial-value").html(formatMoney(soma));
  $("#total-value").html(formatMoney(total));
}

function formatMoney(num) {
  return Number(num).toLocaleString('pt-br', {
    style: 'currency',
    currency: 'BRL'
  });
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
                  <small>Validade: ${expirationDateFormat}</small>
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