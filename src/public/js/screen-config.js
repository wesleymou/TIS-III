$(function() {
  $("#action-password").click(function() {
    let query = {
      oldPassword: $("#old-password").val(),
      newPassword: $("#new-password").val()
		};
		
		if(query.oldPassword && query.newPassword){

    $.post("/screen-config/change-password", query)
      .then(function(res) {
        if (!alert(res)) window.location.reload();
      })
      .fail(function(err) {
        if (!alert(err.responseText)) window.location.reload();
			});
		}else{
			alert("Por favor, complete os dois campos");
		}
  });

  $("#old-password, #new-password").keypress(function(event) {
    if (event.key == "Enter") {
      $("#action-password").click();
    }
  });
});
