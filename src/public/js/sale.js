$(function () {

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
  });
  
  // Cadastra o produto ao clicar no botão de cadastrar
  $('#btn-create').click(function () {
    var dateVal = $('#expirationDateFormInput').val();
    var expDate = null;

    if (dateVal) {
      expDate = new Date(dateVal).toISOString();
    }

    var sale = {
      id: $('#productIdFormInput').val(),
      quantityAvailable: $('#quantityFormInput').val(),
      saleDate: new Date($('#saleDateFormInput').val()).toISOString(),
      expirationDate: expDate,
    };

    $.post('/sale', sale)
      .then(function (response) {
        alert('Venda cadastrada com sucesso!');
        window.location.assign('/sale');
      })
      .fail(function () {
        alert('Ocorreu um erro, verifique as informações e tente novamente.');
      });
  });