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
  $("#check-today").click(function() {
    if ($("#check-today").is(":checked"))
      $("#saleDateFormInput").attr("required", false);
    else $("#saleDateFormInput").attr("required", true);
  });

  // Cadastra a venda ao clicar no botão de cadastrar
  $("#btn-create").click(function() {
    if ($("#sale-form")[0].reportValidity()) {
      var dateVal = $("#expirationDateFormInput").val();
      var expDate = null;
      var saleDate = $("#expirationDateFormInput").val();

      if ($("#check-today").is(":checked")) saleDate = new Date();
      else saleDate = new Date(saleDate).toISOString();

      if (dateVal) {
        expDate = new Date(dateVal).toISOString();
      }

      var sale = {
        id: $("#productIdFormInput").val(),
        quantityAvailable: $("#quantityFormInput").val(),
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
    var dateVal = $("#expirationFormInput").val();
    var expDate = null;

    if (dateVal) {
      expDate = new Date(dateVal).toISOString();
    }

    var product = {
      name: $("#productNameFormInput").val(),
      code: $("#codeFormInput").val(),
      price: $("#priceFormInput").val(),
      description: $("#descriptionFormInput").val(),
      quantityAvailable: $("#quantityFormInput").val(),
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
  });

  // Limpa os campos ao fechar o modal de cadastro
  $("#modal-create-product").on("hide.bs.modal", function() {
    $(this)
      .find("input")
      .val("");
  });
});
