import express from 'express';
import DashBoardService from '../services/DashBoardService';
import DashboardViewModel from '../models/DashboardViewModel';
import ProductListViewModel from '../models/ProductListViewModel';

const router = express.Router();
const dashboardService = new DashBoardService();

router.get('/', (req, res) => {
    const viewModel = new DashboardViewModel();
    res.render('dashboard', viewModel);
});

router.get('/counters', async (req, res) => {
    const counters = await dashboardService.getCounters();
    res.json(counters);
});

router.get('/expiring', async (req, res) => {
    const results = await dashboardService.getExpiringProducts();
    res.json(results);
});

router.get('/overdue', async (req, res) => {
    const results = await dashboardService.getOverdueCustomers();
    res.json(results);
});

router.get('/future-income', async (req, res) => {
    const results = await dashboardService.getFutureIncome();
    res.json(results);
});

export default router;
