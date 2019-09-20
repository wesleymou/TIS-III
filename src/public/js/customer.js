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
      window.location.assign('/customer?q=' + query);
    } else if (searchParams.get('q')) {
      window.location.assign('/customer');
    }
  });

  // Cadastra o usuário ao clicar no botão de cadastrar
  $('#btn-create').click(function () {
    const customer = {
      fullName: $('#nameFormInput').val(),
      nickname: $('#nicknameFormInput').val(),
      phone: $('#phoneFormInput').val(),
      email: $('#emailFormInput').val(),
      address: $('#addressFormInput').val(),
    };

    $.post('/customer', customer)
      .then(function (response) {
        alert('Cliente cadastrado com sucesso!');
        window.location.assign('/customer');
      })
      .fail(function () {
        alert('Ocorreu um erro, verifique as informações e tente novamente.');
      });
  });

  // Limpa os campos ao fechar o modal de cadastro
  $('#modal-create-customer').on('hide.bs.modal', function () {
    $(this).find('input').val('');
  });
});
