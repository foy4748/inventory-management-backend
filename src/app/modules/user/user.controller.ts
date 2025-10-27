import httpStatus from 'http-status';
import catchAsyncError from '../../utils/catchAsyncError';
import sendResponse, { TResponse } from '../../utils/sendResponse';
import IUser, { ILoggedInWithToken, ILoginUser } from './user.interface';
import jwt from 'jsonwebtoken';

import { ScreateUser, SloginUser, SchangeUserPassword } from './user.service';
import config from '../../config';

type cookieSameSite = boolean | 'none' | 'strict' | 'lax' | undefined;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: (process.env.NODE_ENV === 'production'
    ? 'none'
    : 'strict') as cookieSameSite,
  maxAge: 3600 * 1000,
};

export const CcreateUser = catchAsyncError(async (req, res, _) => {
  const { body } = req;
  const data: IUser = await ScreateUser(body);

  const { _id, email, role } = data;
  const token = jwt.sign(
    {
      _id,
      email,
      role,
    },
    String(config?.jwt_access_token),
    { expiresIn: 60 * 60 },
  );

  type payloadType = { user: IUser; token: string };

  const { password, passwordHistory, ...exceptPassword } = data;
  const responseObj: TResponse<payloadType> = {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User registered successfully',
    data: {
      user: exceptPassword,
      token,
    },
  };
  res.cookie('token', token, cookieOptions);
  sendResponse<payloadType>(res, responseObj);
});

export const CloginUser = catchAsyncError(async (req, res, _) => {
  const { body: loginCredentials } = req;
  const currentUser = await SloginUser(loginCredentials);
  const { _id, email, role } = currentUser;

  delete currentUser['password'];
  delete currentUser['passwordHistory'];
  const token = jwt.sign(
    {
      _id,
      email,
      role,
    },
    String(config?.jwt_access_token),
    { expiresIn: 60 * 60 },
  );
  const responseload = { user: currentUser, token } as ILoggedInWithToken;
  const responseObj: TResponse<ILoggedInWithToken> = {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User login successful',
    data: responseload,
  };
  res.cookie('token', token, cookieOptions);
  sendResponse<ILoggedInWithToken>(res, responseObj);
});

export const CchangeUserPassword = catchAsyncError(async (req, res, _) => {
  const { decoded, body } = req;
  const data = await SchangeUserPassword(decoded, body);
  const { password, passwordHistory, ...updatedUser } = data as IUser;
  const responseObj: TResponse<ILoginUser> = {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Password changed successfully',
    data: updatedUser as ILoginUser,
  };
  sendResponse<ILoginUser>(res, responseObj);
});

export const ClogoutUser = catchAsyncError(async (_, res) => {
  res.clearCookie('token', { ...cookieOptions, maxAge: 0 });
  const responseObj: TResponse<boolean> = {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged out successfully',
    data: true,
  };
  sendResponse(res, responseObj);
});
