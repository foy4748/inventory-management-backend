import ISale from '../sale/sale.interface';
import Sale from '../sale/sale.model';

// Create a New Sale
export const ScreateSaleTEST = async (payload: ISale) => {
  const response = await Sale.create(payload);
  return response;
};
