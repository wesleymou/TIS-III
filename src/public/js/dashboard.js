$(function () {
  loadCounters()
    .then(loadExpiringProducts)
    .then(loadOverdueCustomerList)
    .then(loadFutureIncomeList);
});

function loadCounters() {
  return $.get('/dashboard/counters')
    .then((result) => {
      const { customers, products, sales } = result;
      $('.customer-counter').html(formatNumber(customers));
      $('.product-counter').html(formatNumber(products));
      $('.sale-counter').html(formatNumber(sales));
    });
}

function loadExpiringProducts() {
  return $.get('/dashboard/expiring')
    .then(result => {
      const $list = $('.expiring-products-list');
      if (result.length) {
        const products = result.map(product => $(`
            <tr>
              <td><small class="text-black-50">#${product.id}</small></td>
              <td>${product.name}</td>
              <td>${createExpiringProductBadge(product)}</td>
            </tr>
          `)
          .attr('title', new Date(product.expirationDate).toLocaleDateString())
          .tooltip()
        );

        $list.html(products);
      } else {
        $list.html(`
          <tr>
            <td>Nenhum produto prestes a expirar.</td>
          </tr>
        `);
      }
    })
}

function loadOverdueCustomerList() {
  return $.get('/dashboard/overdue')
    .then(result => {
      const $list = $('.overdue-customer-list');
      if (result.length) {
        const customers = result.map(customer => `
            <tr>
              <td>${customer.nickname || customer.fullName}</td>
              <td>${formatMoney(customer.debit)}</td>
              <td>${new Date(customer.overdueSince).toLocaleDateString()}</td>
            </tr>
          `);
        $list.html(customers);
      } else {
        $list.html(`
          <tr>
            <td>Todos os clientes estão em dia!</td>
          </tr>
        `);
      }
    })
}

function loadFutureIncomeList() {
  return $.get('/dashboard/future-income')
    .then(result => {
      const $list = $('.future-income-list');
      if (result.length) {
        const receipts = result.map(receipt => `
            <tr>
              <td>${receipt.name}</td>
              <td>${formatMoney(receipt.total)}</td>
              <td>${new Date(receipt.date).toLocaleDateString()}</td>
            </tr>
          `);
        $list.html(receipts);
      } else {
        $list.html(`
          <tr>
            <td>Todos os clientes estão em dia!</td>
          </tr>
        `);
      }
    })
}

function createExpiringProductBadge(product) {
  const date = new Date(product.expirationDate);

  let label = (text, color) => `
    <span class="badge badge-${color}">
      ${text}
    </span>
  `;

  if (date.valueOf() < Date.now()) {
    return label('Vencido', 'dark');
  }

  // milisegundos em um dia
  const milliseconds = 1000 * 60 * 60 * 24;

  const diff = date.valueOf() - Date.now();
  const days = Math.round(diff / milliseconds);

  if (days > 14) {
    return label('Vence em ' + days + ' dias', 'success');
  }
  if (days === 14) {
    return label('Vence em 2 semanas', 'info');
  }
  if (days > 7) {
    return label('Vence em ' + days + ' dias', 'info');
  }
  if (days === 7) {
    return label('Vence em 1 semana', 'warning');
  }
  if (days > 3) {
    return label('Vence em ' + days + ' dias', 'danger');
  }
  if (days === 1) {
    return label('Amanhã', 'dark');
  }
  if (days < 1) {
    return label('Vence hoje', 'dark');
  }
  return label('Vence em ' + days + ' dias', 'dark');
}