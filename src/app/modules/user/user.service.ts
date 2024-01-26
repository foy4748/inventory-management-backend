import { JwtPayload } from 'jsonwebtoken';
import AppError from '../../error/AppError';
import IUser, { ILoginUser, TPasswordReplacement } from './user.interface';
import User from './user.model';
import bcrypt from 'bcrypt';
import config from '../../config';
import httpStatus from 'http-status';
import moment from 'moment';

export const ScreateUser = async (payload: IUser) => {
  //payload.passwordHistory = [String(payload.password)];
  const response = await User.create(payload);
  return response.toObject();
};

export const SloginUser = async (payload: ILoginUser) => {
  const { username, password } = payload;
  const currentUser = await User.findOne({ username });
  if (!currentUser) {
    throw new AppError(404, `User doesn't exists with username ${username}`);
  }

  const isPasswordMatched = await bcrypt.compare(
    String(password),
    String(currentUser?.password),
  );

  if (!isPasswordMatched) {
    throw new AppError(403, `Invalid Access`);
  }

  return currentUser.toObject();
};

export const SchangeUserPassword = async (
  payload: JwtPayload,
  passwordReplacement: TPasswordReplacement,
) => {
  const { _id: userId } = payload;
  const currentUser = await User.findById(userId);
  //console.log(currentUser);
  const isPasswordMatched = await bcrypt.compare(
    String(passwordReplacement.currentPassword),
    String(currentUser?.password),
  );

  const errorString = `Password change failed. Ensure the new password is unique and not among the last 2 used (last used on ${moment(
    currentUser?.updatedAt,
  ).format('YYYY-MM-DD')} at ${moment(currentUser?.updatedAt).format(
    'hh:mm A',
  )}.`;

  if (!isPasswordMatched) {
    throw new Error(errorString);
  }

  if (passwordReplacement.currentPassword == passwordReplacement.newPassword) {
    throw new Error(errorString);
  }

  for (const oldPassword of currentUser?.passwordHistory as string[]) {
    const isPasswordMatched = await bcrypt.compare(
      String(passwordReplacement.newPassword),
      String(oldPassword),
    );
    if (isPasswordMatched) {
      throw new Error(errorString);
    }
  }
  const newPassword = await bcrypt.hash(
    passwordReplacement.newPassword as string,
    Number(config?.bcrypt_salt_rounds),
  );

  currentUser?.passwordHistory?.push(String(currentUser?.password));
  if (Number(currentUser?.passwordHistory?.length) > 2) {
    currentUser?.passwordHistory?.shift();
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      //$addToSet: { passwordHistory: currentUser?.password },
      $set: {
        password: newPassword,
        passwordHistory: currentUser?.passwordHistory,
      },
    },
    { new: true },
  );

  return updatedUser?.toObject();
};
