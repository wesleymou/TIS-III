$(function() {
  $("#tabelaVendas").dataTable();

  $(".products-detail-action").click(function() {
    $.get(`/sales-history/${$(this).data("id")}`).then(res => {
      $("#TituloModal").html(res[0].saleId);
      res.forEach(row => {
        $("#myModal #modal-table-body").append(`
          <tr>
            <td>${row.name}</td>
            <td>${row.expirationDateFormat}</td>
            <td>${row.quantity}</td>
            <td>${row.priceFormat}</td>
            <td>${row.priceSoldFormat}</td>
          </tr>
        `);
      });
      $("#myModal").modal();
    });
  });
});
