const apiRoutes = {
  // DELETE Methods
  flushDB: {
    methd: 'DELETE',
    path: '/api/test/flush-db',
  },
  // POST Methods ====================
  // createCourse: {
  //   method: 'POST',
  //   path: '/api/course',
  // },
  createSale: {
    method: 'POST',
    path: '/api/test/post-fake-sale-data', // Updated in Assignment 04
  },
  userLogin: {
    method: 'POST',
    path: '/api/auth/login',
  },
};

module.exports = apiRoutes;
