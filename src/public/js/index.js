$(function () {

  $('#login, #password').keypress(function (e) {
    if (e.key === 'Enter') {
      $('#submitButton').click();
    }
  });

  $('#submitButton').click(function () {
    var user = {
      login: $('#login').val(),
      password: $('#password').val(),
    };

    if (!user.login) {
      noty('Usuário inválido.', 'error');
      return;
    }
    if (!user.password) {
      noty('Senha inválida.', 'error');
      return;
    }

    signIn(user);
  });

  function signIn(user) {
    $.post('/user/signin', user)
      .then(function () {
        window.location.reload()
      })
      .fail(function (jqXHR) {
        noty('Erro: ' + jqXHR.responseText + '.', 'error');
      });
  }
});