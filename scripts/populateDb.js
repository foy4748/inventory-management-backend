const apiRoutes = require('./apiRoutes');
const { randomIntFromInterval, returnRandomItem } = require('./utils');
const sampleData = require('./data');
const axios = require('axios');
const moment = require('moment');
const { config } = require('dotenv');
config();

const client = axios.create({
  baseURL: 'http://localhost:3001',
  //baseURL: 'https://apollo-assignment-04.vercel.app',
  headers: {
    secret: process.env.FLUSH_DB_SECRET,
  },
});

// Flushing DB
const flushDB = async () => {
  const { data } = await client.delete(apiRoutes.flushDB.path);
  console.log(data);
};

// Logging in As User
const user_token = { token: '' };
const userCredentials = {
  username: 'test_user',
  password: '12345678',
};
const loginAsUser = async () => {
  console.log('Trying to login as User for creating reviews');
  const { data } = await client.post(apiRoutes.userLogin.path, userCredentials);
  const { token } = data.data;
  client.defaults.headers.common['Authorization'] = token;
  user_token.token = token;
  console.log('User Login successfull');
};

// Creating Courses
const createdSales = [];
const previousYears = [2023, 2022, 2021, 2020];
const createFakeSaleRecords = async () => {
  let count = 0;
  for (const year of previousYears) {
    for (let i = 0; i < 25; i++) {
      const currentSale = {
        quantity: null, //
        price: null, //
        sale_date: null, //
        product_id: null,
        name: null, //
        brand: null, //
        modelNo: null, //
        buyer_name: null, //
      };
      currentSale.quantity = randomIntFromInterval(0, 1000);
      currentSale.price = randomIntFromInterval(0, 500);
      currentSale.product_id = '65b7c4df5f9fa855638a611a';
      currentSale.name = 'Test Sale || ' + ` ${count}`;
      currentSale.brand = 'Test Brand || ' + ` ${count}`;
      currentSale.modelNo = 'Test Model || ' + ` ${count}`;
      currentSale.buyer_name = 'Test Buyer || ' + ` ${count}`;

      // Randomly generating Sale Date
      const randomDay = String(
        Math.round(randomIntFromInterval(1, 28)),
      ).padStart(2, '0');

      const randomMonth = String(
        Math.round(randomIntFromInterval(1, 12)),
      ).padStart(2, '0');

      currentSale.sale_date = moment(`${year}-${randomMonth}-${randomDay}`);

      const { data } = await client.post(
        apiRoutes.createSale.path,
        currentSale,
      );
      createdSales.push(data.data);
      count++;
    }
  }
};

async function main() {
  await flushDB();
  console.log(
    'Started populating DB with sample data. (except User Collection)',
  );
  await loginAsUser();
  await createFakeSaleRecords();
  console.log(
    'Populated DB with sample data successfully. (except User collection)',
  );
}
main();
