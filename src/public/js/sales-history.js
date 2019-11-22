$(function() {
  $("#tabelaVendas").dataTable();

  $(function() {
    $('[data-toggle="popover"]').popover();
  });

  $(".products-detail-action").click(function() {
    $.get(`/sales-history/sale-items/${$(this).data("id")}`).then(res => {
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

  $(document).on("click", "#edit-action", function() {
    if ($(this).data("status") == 2) {
      noty("Não é possível alterar vendas canceladas");
    } else {
      $.get(`/sales-history/get-sale/${$(this).data("id")}`)
        .then(res => {
          if (res.saleStatus != 2) {
            alert("Impossível editar registros de vendas canceladas.");
          } else {
            let sale = res;
            $("#modal-edit #TituloModal")
              .data("sale", sale)
              .html(sale.id);

            $("#modal-edit #input-data-payment").val(
              parseDate(new Date(sale.datePayment))
            );

            $("#modal-edit #input-customer")
              .data("id", sale.customerId)
              .html(sale.CustomerName);
            $("#modal-edit #input-status")
              .data("id", sale.saleStatus)
              .html(sale.statusFormat.name);
            $("#modal-edit #input-payment")
              .data("id", sale.paymentMethodId)
              .html(sale.paymentMethodFormat.name);

            $("#modal-edit").modal("show");
          }
        })
        .fail(err => {
          noty(err.responseText, "error", () => window.location.reload());
        });
    }
  });

  $("#input-customer, #input-status, #input-payment").click(function() {
    const key = $(this).data("key");
    if (key == "customer") {
      $.get("/sales-history/get-customer").then(res => {
        let body = getAllCustomer(res);
        preencherModalPopUp(body[0], body[1]);
      });
    } else if (key == "status") {
      $.get("/sales-history/get-sales-status").then(res => {
        let body = getAllSaleStatus(res);
        preencherModalPopUp(body[0], body[1]);
      });
    } else if (key == "payment") {
      $.get("/sales-history/get-payment-methods").then(res => {
        let body = getAllPaymentMethods(res);
        preencherModalPopUp(body[0], body[1]);
      });
    }
  });

  $("#pop-up-save").click(function() {
    confirmDialog("Tem certeza que deseja salvar essas alterações?", () => {
      const sale = $("#modal-edit #TituloModal").data("sale");

      const query = {
        id: $("#modal-edit #TituloModal").html(),
        customerId: $("#modal-edit #input-customer").data("id"),
        saleStatus: $("#modal-edit #input-status").data("id"),
        paymentMethodId: $("#modal-edit #input-payment").data("id"),
        datePayment: $("#input-data-payment")
          .val()
          .substr(0, sale.datePayment.length)
      };

      const saleUpdate = Object.assign(sale, query);

      $.post("/sales-history/update-sale", saleUpdate)
        .then(res => {
          if (!alert(res)) window.location.reload();
        })
        .fail(err => {
          if (!alert(err.responseText)) window.location.reload();
        });
    });
  });

  $(document).on("click", "#confirm-action", function() {
    if ($(this).data("status") == 2) {
      noty("Não é possível alterar vendas canceladas");
    } else {
      confirmDialog(
        `Tem certeza que deseja alterar o status da venda ${$(this).data(
          "id"
        )} para "Finalizada"`,
        () => {
          $.post(`/sales-history/confirm-sale/${$(this).data("id")}`)
            .then(res => {
              if (!alert(res)) window.location.reload();
            })
            .fail(err => {
              if (!alert(err.responseText)) window.location.reload();
            });
        }
      );
    }
  });

  $(document).on("click", "#cancel-action", function() {
    if ($(this).data("status") == 2) {
      noty("Não é possível alterar vendas canceladas");
    } else {
      confirmDialog("Tem certeza que deseja cancelar essa venda?", () => {
        $.post(`/sales-history/cancel-sale/${$(this).data("id")}`)
          .then(res => {
            noty(res, "success", () => window.location.reload());
          })
          .fail(err => {
            noty(err.responseText, "error", () => window.location.reload());
          });
      });
    }
  });
});

function getAllCustomer(obj) {
  let table = ["", ""];

  table[0] = `<tr><th>Cliente</th><th>Apelido</th></tr>`;

  obj.forEach(o => {
    table[1] += `<tr><td><a class="pop-up-action" href="#" data-id="${o.id}" data-key="customer">${o.nickname}</a></td><td>${o.fullName}</td></tr>`;
  });

  return table;
}

function getAllPaymentMethods(obj) {
  obj = Object.keys(obj).map(k => obj[k]);
  let table = ["", ""];

  table[0] = `<tr><th>Metodo</th></tr>`;

  obj.forEach(o => {
    table[1] += `<tr><td><a class="pop-up-action" href="#" data-id="${o.id}" data-key="payment">${o.name}</a></td></tr>`;
  });

  return table;
}

function getAllSaleStatus(obj) {
  obj = Object.keys(obj).map(k => obj[k]);
  let table = ["", ""];

  table[0] = `<tr><th>Status</th></tr>`;

  obj.forEach(o => {
    table[1] += `<tr><td><a class="pop-up-action" href="#" data-id="${o.id}" data-key="status">${o.name}</a></td></tr>`;
  });

  return table;
}

function preencherModalPopUp(head, body) {
  $("#modal-pop-up #modal-table-head").html(head);
  $("#modal-pop-up #modal-table-body").html(body);
  $("#modal-edit").modal("hide");
  $("#modal-pop-up").modal("show");
  if ($.fn.dataTable.isDataTable("#modal-pop-up #modal-table"))
    $("#modal-pop-up #modal-table").dataTable({
      // searching: true
    });

  $(".pop-up-action").click(function() {
    alterarDados($(this).data("id"), $(this).data("key"), $(this).html());
  });
}

function alterarDados(id, key, htmlValue) {
  $(`#modal-edit #input-${key}`)
    .data("id", id)
    .html(htmlValue);
  $("#modal-pop-up").modal("hide");
  $("#modal-edit").modal("show");
}
