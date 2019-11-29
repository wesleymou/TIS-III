$(function () {
  $('#tabelaProdutos').DataTable();

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

  $('.remove-action').click(function () {
    const id = $(this).data('id');

    confirmDialog('Deseja realmente remover este produto?', () => deleteProduct(id));
  });

  // Muda o texto do modal para cadastrar e abre o modal ao clicar no botão de adicionar
  $('.btn-open-create-modal').click(function () {
    $('#modal-create-product').find('h2').text('Cadastrar produto');
    $('#modal-create-product').modal('show');
  });

  // Cadastra ou edita o produto ao clicar no botão de confirmar
  $('#btn-create').click(function () {
    var product = {
      name: $('#productNameFormInput').val(),
      description: $('#descriptionFormInput').val(),
    };

    const id = $('#idFormInput').val();

    if (id) {
      editProduct(id, product);
    } else {
      createProduct(product);
    }
  });

  $('.edit-action').click(function () {
    $('#modal-create-product').find('h2').text('Editar produto');

    const id = $(this).data('id');

    $.get('/product/' + id)
      .then((product) => setModalInputs(product))
      .catch((err) => noty('Ocorreu um erro ao buscar os dados do produto.', 'error'));
  });

  // Limpa os campos ao fechar o modal de cadastro
  $('#modal-create-product').on('hide.bs.modal', function () {
    $(this).find('input').val('');
  });
});

/**
 * Cadastra um produto no banco de dados
 * @param {any} product Informações do produto a ser cadastrado
 */
function createProduct(product) {
  $.post('/product', product)
    .then(function () {
      noty('Produto cadastrado com sucesso!', 'success', () => window.location.reload());
    })
    .fail(function () {
      noty('Ocorreu um erro, verifique as informações e tente novamente.', 'error');
    });
}

/**
 * Edita um produto a partir de um objeto com as alterações
 * @param {number} id Id do produto
 * @param {any} product Informações do produto para editar
 */
function editProduct(id, product) {
  $.ajax({
    url: '/product/' + id,
    method: 'PUT',
    data: JSON.stringify(product),
    contentType: 'application/json'
  })
    .then(function () {
      noty('Produto atualizado com sucesso!', 'success', () => window.location.reload());
    })
    .fail(function () {
      noty('Ocorreu um erro, verifique as informações e tente novamente.', 'error');
    });
}

/**
 * Remove o produto a partir de um id
 * @param {number} id Id do produto
 */
function deleteProduct(id) {
  $.ajax({
    url: '/product/' + id,
    method: 'DELETE'
  })
    .then(() => {
      noty('Produto removido com sucesso!', 'success', () => window.location.reload());
    })
    .catch(() => noty('Ocorreu um erro ao tentar remover o produto.', 'error'));
}

/**
 * Atualiza os inputs do modal com os dados do produto
 * @param {object} product Dados do cliente
 */
function setModalInputs(product) {
  $('#idFormInput').val(product.id);
  $('#productNameFormInput').val(product.name);
  $('#descriptionFormInput').val(product.description);
  $('#modal-create-product').modal('show');
}
