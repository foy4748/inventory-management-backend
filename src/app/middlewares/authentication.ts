import { RequestHandler } from 'express';
import { TuserRole } from '../modules/user/user.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config/index';
import AppError from '../error/AppError';
import catchAsyncError from '../utils/catchAsyncError';

type TDecodedJWT = {
  _id: string;
  role: TuserRole;
  email: string;
  iat: number;
  exp: number;
};

const authentication = (): RequestHandler => {
  return catchAsyncError((req, _, next) => {
    const { authorization } = req.headers;
    //console.log(authorization);
    let decoded;
    try {
      decoded = jwt.verify(
        String(authorization),
        String(config?.jwt_access_token),
      ) as TDecodedJWT;
    } catch (error) {
      throw new AppError(403, 'Unauthorized Access 1');
    }

    if (decoded) {
      // JWT Expiry: The provided JWT (JSON Web Token) has expired.
      req.decoded = decoded as JwtPayload;
      next();
    } else {
      // Undefined JWT: No JWT is provided in the request headers.
      // Invalid JWT: The JWT provided is invalid or malformed.
      throw new AppError(403, 'Unauthorized Access 2');
    }
  });
};

export default authentication;
