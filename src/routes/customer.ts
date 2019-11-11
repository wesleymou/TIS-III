import createError from 'http-errors';
import { Router, Request, Response, NextFunction } from "express";
import CustomerService from "../services/CustomerService";
import Customer from '../models/Customer';
import CustomerListViewModel from '../models/CustomerListViewModel';
import { createCustomerViewModel } from '../models/CustomerViewModel';
import { checkAuthToken } from '../middlewares/session-check';

const service = new CustomerService();
const router = Router();

router.use(checkAuthToken);

router.get('/', async (req, res, next) => {
  try {
    const query: string | undefined = req.query.q;

    const customers = query
      ? await service.searchAsync(query)
      : await service.getAllAsync();

    const viewModel = new CustomerListViewModel(customers);

    res.render('customer-list', { title: 'Figaro - Clientes', ...viewModel });
  } catch (err) {
    next(createError(500, err));
  }
});

router.get('/search', async (req, res, next) => {
  try {
    req.query.q
    const customers = await service.searchAsync(req.query.q);
    const viewModel = new CustomerListViewModel(customers);
    res.json(viewModel.customers);
  } catch (err) {
    next(createError(500, err));
  }
});

router.get('/:id(\d+)', async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const customer = await service.getByIdAsync(id);

    const viewModel = createCustomerViewModel(customer);

    res.json(viewModel);
  } catch (err) {
    next(createError(500, err));
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = validateCustomerFromRequestBody(req.body);

    if (customer == null) {
      return next(createError(400, new Error('Informações inválidas.')))
    }

    await service.createAsync(customer);

    res.status(201).send();
  } catch (err) {
    next(createError(500, err));
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const customer = validateCustomerFromRequestBody(req.body);

    if (customer == null) {
      return next(createError(400, new Error('Informações inválidas.')))
    }

    // remover campos que não podem ser alterados
    delete customer.id;
    delete customer.dateCreated;

    await service.updateWithIdAsync(id, customer);

    res.send('OK');
  } catch (err) {
    next(createError(500, err));
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const customer = await service.removeAsync(id);

    res.send('OK');
  } catch (err) {
    next(createError(500, err));
  }
});

/**
 * Valida e converte um objeto para o tipo Customer.
 * Retorna o produto ou null, se o objeto for inválido.
 * @param obj Objeto que será convertido
 */
function validateCustomerFromRequestBody(obj: any): Customer | null {
  const {
    fullName,
    nickname,
    phone,
    email,
    address
  } = obj;

  if (!fullName || !phone) {
    return null;
  }

  const customer = new Customer();

  const result: Customer = {
    ...customer,
    fullName,
    nickname,
    phone,
    email,
    address
  };

  return result;
}

export default router;
