export type TuserRole = 'user' | 'admin';

interface IUser {
  _id?: string;
  username: string;
  password?: string;
  email: string;
  role: TuserRole;
  passwordHistory?: string[];
  updatedAt: Date;
}

export type TPasswordReplacement = {
  currentPassword: string;
  newPassword: string;
};

export interface ILoginUser {
  username: string;
  password?: string;
}

export interface ILoggedInWithToken {
  user: IUser;
  token: string;
}

export default IUser;
