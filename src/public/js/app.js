$(function () {
  $.extend($.fn.dataTable.defaults, {
    searching: false,
    language: {
      "sEmptyTable": "Nenhum registro encontrado",
      "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
      "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
      "sInfoFiltered": "(Filtrados de _MAX_ registros)",
      "sInfoPostFix": "",
      "sInfoThousands": ".",
      "sLengthMenu": "_MENU_ resultados por página",
      "sLoadingRecords": "Carregando...",
      "sProcessing": "Processando...",
      "sZeroRecords": "Nenhum registro encontrado",
      "sSearch": "Pesquisar",
      "oPaginate": {
        "sNext": "Próximo",
        "sPrevious": "Anterior",
        "sFirst": "Primeiro",
        "sLast": "Último"
      },
      "oAria": {
        "sSortAscending": ": Ordenar colunas de forma ascendente",
        "sSortDescending": ": Ordenar colunas de forma descendente"
      },
      "select": {
        "rows": {
          "_": "Selecionado %d linhas",
          "0": "Nenhuma linha selecionada",
          "1": "Selecionado 1 linha"
        }
      }
    }
  });

  $(function () {
    $('.table-action').tooltip();
    $('[data-toggle="tooltip"]').tooltip();
  });

});

function parseDate(date) {
  const [day, month, year, hour, min, sec] = date.toLocaleString().split(/[^0-9]/);
  return `${year}-${month}-${day}T${hour}:${min}:${sec}`;
}

/**
 * Cria e configura uma instância do Noty, mas não dispara a notificação.
 * Se for passada uma função de callback, um botão OK é 
 * exibido, e a função é invocada.
 * @param {string} message Mensagem da notificação
 * @param {string} type Estilo do painel de notificação
 * @param {() => void} callback Função de retorno
 * @param {any} options Opções do Noty
 */
function createNoty(message, type, callback, options) {
  const defaults = {
    theme: 'bootstrap-v4',
    layout: 'topRight',
    text: message,
    type: type || 'info',
    timeout: 5000
  };


  if (typeof callback === 'function') {
    const btnClass = defaults.type === 'error' ? 'danger' : defaults.type;

    defaults.buttons = [
      Noty.button('OK', 'btn btn-sm btn-' + btnClass, callback)
    ]

    defaults.callbacks = { onClose: callback };
  }

  return new Noty({ ...defaults, ...options });
}

/**
 * Fecha todas as notificações ativas na tela e 
 * dispara uma notificação imediatamente.
 * @param {string} message Mensagem da notificação
 * @param {string} type Estilo do painel de notificação
 * @param {() => void} callback Função de retorno
 * @param {any} options Opções do Noty
 */
function noty(message, type, callback, options) {
  Noty.closeAll();
  const n = createNoty(message, type, callback, options);
  n.show();
  return n;
}

/**
 * Mostra uma pergunta com botões para o usuário responder Sim ou Não.
 * Se a resposta for sim, a funcão `onConfirm` é invocada, caso contrário,
 * a janela de pergunta é fechada.
 * @param {string} message Mensagem de confirmação
 * @param {() => void} onConfirm Callback caso a resposta seja sim
 */
function confirmDialog(message, onConfirm) {
  Noty.closeAll();
  const n = createNoty(message, 'alert', null, {
    timeout: 0,
    buttons: [
      Noty.button('Sim', 'btn btn-sm btn-primary mr-2', () => onConfirm()),
      Noty.button('Não', 'btn btn-sm btn-danger', () => n.close())
    ]
  });
  n.show();
}
