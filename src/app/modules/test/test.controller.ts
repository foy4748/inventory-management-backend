//import Product from '../product/product.model';
import Sale from '../sale/sale.model';
import catchAsyncError from '../../utils/catchAsyncError';
import config from '../../config';
import { ScreateSaleTEST } from './test.service';

export const CflushDb = catchAsyncError(async (req, res, _) => {
  if (req.headers.secret == config.flash_db_secret) {
    await Sale.deleteMany();

    return res.send({ error: false, message: 'Flushed DB successfully' });
  } else {
    return res.send({ error: true, message: 'Secret was not provided' });
  }
});

export const CPostSaleDataBrutally = catchAsyncError(async (req, res, _) => {
  if (req.headers.secret == config.flash_db_secret) {
    await ScreateSaleTEST(req.body);

    return res.send({
      error: false,
      message: 'Posted Fake Test Sale Data DB successfully',
    });
  } else {
    return res.send({ error: true, message: 'Secret was not provided' });
  }
});
