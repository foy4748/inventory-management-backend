import express from 'express';
//import userRoutes from '../modules/user/user.route';
import userRoutes from '../modules/user/user.route';
import productRoutes from '../modules/product/product.route';
import saleRoutes from '../modules/sale/sale.route';

import testRoutes from '../modules/test/test.route';
const globalRoutes = express.Router();

const routes = [
  {
    path: '/products',
    element: productRoutes,
  },
  {
    path: '/sales',
    element: saleRoutes,
  },
  {
    path: '/auth',
    element: userRoutes,
  },
  // Test Routes
  {
    path: '/test',
    element: testRoutes,
  },
];

routes.forEach((route) => globalRoutes.use(route.path, route.element));

export default globalRoutes;
