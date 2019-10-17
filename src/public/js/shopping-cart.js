$(function() {
  //Adiciona itens da lista para o carrinho. Se o produto já foi adicionado, mostra um alert
  $(".list-group-item-action").click(function() {
    let exists = false;
    let skus = $(".product-sku");

    for (let i = 0; i < skus.length; i++) {
      if (
        skus[i].innerHTML ==
        $(this)
          .find("span")
          .html()
      ) {
        alert("Produto já adicionado");
        return;
      }
    }

    $("#card-itens").append(`
        <div class="d-flex justify-content-between mb-3 bg-list px-3 py-2" id="cart-itens">
            <span>${$(this)
              .find("h4")
              .html()}</span>
            <input type="number" class="form-control product-quantity" value=1 style="width: 50px">
            <span class="product-price">${$(this)
              .find("h5")
              .html()}</span>
            <span class="product-sku" hidden>${$(this)
              .find("span")
              .html()}</span>
        </div>
    `);
    $(".product-quantity").change(() => atualizarValores());
  });

  //Altera o valor total e o parcial ao mudar a quantidade de itens
  $(".product-quantity").change(() => atualizarValores());

  //Altera o valor parcial e o valor total ao adicionar itens no carrinho
  $("#card-itens").bind("DOMSubtreeModified", () => atualizarValores());

  //Altera o valor total ao mudar o valor do desconto
  $("#discount").change(function() {
    $("#total-value").html(
      parseFloat($("#partial-value").html()).toFixed(2) - $("#discount").val()
    );
  });

  $("#finalize").click(function() {
    if (parseFloat($("#total-value").html()) != 0) {
      let cart = {
        products: [],
        descont: $("#discount").val(),
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
  let soma = 0;
  for (let i = 0; i < $("#card-itens").find("div").length; i++) {
    soma +=
      parseFloat(
        $("#card-itens")
          .find(`div:eq(${i})`)
          .find(".product-price")
          .html()
      ) *
      parseFloat(
        $("#card-itens")
          .find(`div:eq(${i})`)
          .find(".product-quantity")
          .val()
      );
  }
  $("#partial-value").html(soma.toFixed(2));
  $("#total-value").html((soma - $("#discount").val()).toFixed(2));
}