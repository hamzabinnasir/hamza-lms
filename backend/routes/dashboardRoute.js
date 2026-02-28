import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import userAuth from '../middleware/userAuth.js';

const dashboardRouter = express.Router();

dashboardRouter.get('/stats', userAuth, getDashboardStats);

export default dashboardRouter;
