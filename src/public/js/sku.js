$(function () {
  var productId = $('#productId').val();

  /**
   * Itens pesquisados na query string
   */
  var searchParams = new URLSearchParams(window.location.search);

  // Foca o usuário no input de pesquisa ao iniciar a tela
  $('#query-input').focus();

  // Clica no botão de busca ao apertar a tecla Enter no campo de busca
  $('#query-input').keypress(function (e) {
    if (e.key === 'Enter') {
      $('#btn-search').click();
    }
  });

  // Filtra os resultado da tabela ao clicar no botão de busca
  $('#btn-search').click(function () {
    var query = $('#query-input').val();
    if (query) {
      window.location.assign('/product?q=' + query);
    } else if (searchParams.get('q')) {
      window.location.assign('/product');
    }
  });

  // Adiciona a unidade ao clicar no botão de adicionar
  $('#btn-create').click(function () {
    var dateVal = $('#expirationDateFormInput').val();
    var expDate = null;

    if (dateVal) {
      expDate = new Date(dateVal).toISOString();
    }

    var sku = {
      price: $('#priceFormInput').val(),
      quantityAvailable: $('#quantityFormInput').val(),
      expirationDate: expDate,
    };

    $.post('/product/' + productId, sku)
      .then(function (response) {
        alert('Item cadastrado com sucesso!');
        window.location.assign('/product/' + productId);
      })
      .fail(function () {
        alert('Ocorreu um erro, verifique as informações e tente novamente.');
      });
  });
});