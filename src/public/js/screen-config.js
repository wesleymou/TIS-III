$(function () {
  $("#action-password").click(function () {
    let query = {
      oldPassword: $("#old-password").val(),
      newPassword: $("#new-password").val()
    };

    if (query.oldPassword && query.newPassword) {

      $.post("/screen-config/change-password", query)
        .then(function (res) {
          noty(res, 'success', () => window.location.reload());
        })
        .fail(function (err) {
          noty(err.responseText, 'error', () => window.location.reload());
        });
    } else {
      noty("Por favor, complete os dois campos", 'error');
    }
  });

  $("#old-password, #new-password").keypress(function (event) {
    if (event.key == "Enter") {
      $("#action-password").click();
    }
  });
});
