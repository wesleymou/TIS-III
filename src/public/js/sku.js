/**
 * Id do produto atual
 * @type {number}
 */
var productId;

$(function () {
  // pegando o id do produto do campo oculto
  productId = $('#productId').val();

  /**
   * Modal de adicionar/editar sku
   */
  const $modal = $('#modal-sku');

  /**
   * Itens pesquisados na query string
   */
  var searchParams = new URLSearchParams(window.location.search);

  if ($('#tabelaProdutos [data-id]').length) {
    $('#tabelaProdutos').DataTable();
  }

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

  // Abre o modal ao clicar no botão de adicionar estoque
  $('.btn-add-sku').click(function () {
    $modal.find('h2').html('Adicionar unidade de estoque.');
    $modal.modal('show');
  });

  $('.edit-action').click(function () {
    $modal.find('h2').html('Adicionar unidade de estoque.');

    const id = $(this).data('id');

    $.get('/product/sku/' + id)
      .then((sku) => {
        setModalInputs(sku);
        $modal.modal('show');
      })
      .catch(() => noty('Ocorreu um erro ao buscar os dados da unidade.', 'error'));
  });

  $('.remove-action').click(function () {
    const id = $(this).data('id');
    confirmDialog('Deseja realmente remover esta unidade?', () => deleteSku(id));
  });

  // Adiciona a unidade ao clicar no botão de adicionar
  $('#btn-save').click(function () {
    var dateVal = $('#expirationDateFormInput').val();
    var expDate = null;

    if (dateVal) {
      const [year, month, day] = dateVal.split('-').map(Number);
      expDate = new Date(year, month - 1, day).toISOString();
    }

    var sku = {
      price: $('#priceFormInput').val(),
      quantityAvailable: $('#quantityFormInput').val(),
      expirationDate: expDate,
    };

    const id = $('#idFormInput').val();

    if (id) {
      editSku(id, sku);
    } else {
      createSku(sku);
    }
  });

  // Limpa campos ao fechar o modal
  $modal.on('hide.bs.modal', function () {
    $(this).find('input').val('');
  });
});

/**
 * Cria uma nova unidade para o produto atual
 * @param {any} sku Informações da unidade de estoque
 */
function createSku(sku) {
  $.post('/product/' + productId, sku)
    .then(function (response) {
      noty('Item cadastrado com sucesso!', 'success', () => window.location.reload());
    })
    .fail(function () {
      noty('Ocorreu um erro, verifique as informações e tente novamente.', 'error');
    });
}

/**
 * Atualiza os campos de um dado sku
 * @param {number} id Id do sku
 * @param {any} update Campos para atualizar
 */
function editSku(id, update) {
  $.ajax({
    url: '/product/sku/' + id,
    method: 'PUT',
    data: JSON.stringify(update),
    contentType: 'application/json'
  })
    .then(function () {
      noty('Unidade atualizada com sucesso!', 'success', () => window.location.reload());
    })
    .fail(function () {
      noty('Ocorreu um erro, verifique as informações e tente novamente.', 'error');
    });
}

/**
 * Apaga um sku do banco de dados
 * @param {number} id Id do sku a ser removido
 */
function deleteSku(id) {
  $.ajax({
    url: '/product/sku/' + id,
    method: 'DELETE'
  })
    .then(function () {
      noty('Unidade removida com successo.', 'success', () => window.location.reload());
    })
    .catch(function () {
      noty('Ocorreu um erro :(', 'error');
    });
}

function setModalInputs(sku) {
  const expDate = new Date(sku.expirationDate);

  let expDateVal = '';

  if (expDate.valueOf()) {
    const day = String(expDate.getDate()).padStart(2, '0');
    const month = String(expDate.getMonth() + 1).padStart(2, '0');
    const year = expDate.getFullYear();

    expDateVal = [year, month, day].join('-');
  }

  $('#idFormInput').val(sku.id);
  $('#quantityFormInput').val(sku.quantityAvailable);
  $('#priceFormInput').val(sku.price);
  $('#expirationDateFormInput').val(expDateVal);
}
