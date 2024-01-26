import express from 'express';
import courseRoutes from '../modules/course/course.route';
//import userRoutes from '../modules/user/user.route';
import userRoutes from '../modules/user/user.route';

import testRoutes from '../modules/test/test.route';
const globalRoutes = express.Router();

const routes = [
  {
    path: '/',
    element: courseRoutes,
  },
  {
    path: '/auth',
    element: userRoutes,
  },
  // Test Routes
  {
    path: '/flush-db',
    element: testRoutes,
  },
];

routes.forEach((route) => globalRoutes.use(route.path, route.element));

export default globalRoutes;
