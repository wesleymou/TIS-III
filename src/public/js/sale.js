$(function() {
  /**
   * Itens pesquisados na query string
   */
  var searchParams = new URLSearchParams(window.location.search);

  // Foca o usuário no input de pesquisa ao iniciar a tela
  $("#query-input").focus();

  // Clica no botão de busca ao apertar a tecla Enter no campo de busca
  $("#query-input").keypress(function(e) {
    if (e.key === "Enter") {
      $("#btn-search").click();
    }
  });

  // Filtra os resultado da tabela ao clicar no botão de busca
  $("#btn-search").click(function() {
    var query = $("#query-input").val();
    if (query) {
      window.location.assign("/product?q=" + query);
    } else if (searchParams.get("q")) {
      window.location.assign("/product");
    }
  });

  //Altera a propriedade "required" dos campos de data
  $(".check-today").click(function() {
    let input = $(this).parent().parent().find("#saleDateFormInput");
    if ($(this).is(":checked"))
      $(input).attr("required", false);
    else $(input).attr("required", true);
  });

  // Cadastra a venda ao clicar no botão de cadastrar
  $("#btn-create").click(function() {
    if ($("#sale-form")[0].reportValidity()) {
      var dateVal = $("#sale-form #expirationDateFormInput").val();
      var expDate = null;
      var saleDate;

      if (!$("#sale-form #saleDateFormInput").is(":required")) saleDate = new Date();
      else saleDate = new Date($("#sale-form #saleDateFormInput").val()).toISOString();

      if (dateVal) {
        expDate = new Date(dateVal).toISOString();
      }

      var sale = {
        id: $("#sale-form #codeFormInput").val(),
        quantityAvailable: $("#sale-form #quantityFormInput").val(),
        saleDate: saleDate,
        expirationDate: expDate
      };

      $.post("/sale", sale)
        .then(function(response) {
          alert("Venda cadastrada com sucesso!");
          window.location.assign("/sale");
        })
        .fail(function() {
          alert("Ocorreu um erro, verifique as informações e tente novamente.");
        });
    }
  });

  // Cadastra o produto ao clicar no botão de cadastrar
  $("#btn-create-product").click(function() {
    if($("#product-form")[0].reportValidity()){
    var dateVal = $("#product-form #expirationDateFormInput").val();
    var expDate = null;
    var saleDate;

    if (!$("#product-form #saleDateFormInput").is(":required")) saleDate = new Date();
    else saleDate = new Date($("#product-form #saleDateFormInput").val()).toISOString();

    if (dateVal) {
      expDate = new Date(dateVal).toISOString();
    }

    var product = {
      name: $("#product-form #productNameFormInput").val(),
      code: $("#product-form #codeFormInput").val(),
      price: $("#product-form #priceFormInput").val(),
      description: $("#product-form #descriptionFormInput").val(),
      quantityAvailable: $("#product-form #quantityFormInput").val(),
      saleDate: saleDate,
      expirationDate: expDate
    };

    $.post("/sale/product", product)
      .then(function(response) {
        alert("Produto cadastrado com sucesso!");
        window.location.assign("/product");
      })
      .fail(function() {
        alert("Ocorreu um erro, verifique as informações e tente novamente.");
      });
    }
  });

  // Limpa os campos ao fechar o modal de cadastro
  $("#modal-create-product").on("hide.bs.modal", function() {
    $(this)
      .find("input")
      .val("");
  });
});
