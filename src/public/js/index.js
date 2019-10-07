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
      alert('Usuário inválido.');
      return;
    }
    if (!user.password) {
      alert('Senha inválida.');
      return;
    }

    signIn(user);
  });

  function signIn(user) {
    $.post('/user/signin', user)
      .then(function () {
        window.location.assign('/product')
      })
      .fail(function (jqXHR) {
        alert('Erro: ' + jqXHR.responseText + '.');
      });
  }
});