import { RequestHandler } from 'express';
import { TuserRole } from '../modules/user/user.interface';
import catchAsyncError from '../utils/catchAsyncError';

const validateRole = (role: TuserRole): RequestHandler => {
  return catchAsyncError((req, _, next) => {
    if (String(req.decoded?.role) == role) {
      next();
    } else {
      // Not Authorized User: The user does not possess the required permissions for the requested action or resource.
      // Access Denied: The user is attempting to access a resource without the necessary authorization.
      throw new Error('Unauthorized Access');
    }
  });
};

export default validateRole;
