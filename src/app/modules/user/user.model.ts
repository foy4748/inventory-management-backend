import { Schema, model } from 'mongoose';
import IUser from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    passwordHistory: { type: [String] },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
// ----------------------------------- Defining Mongoose Middlewares -----------------------------------

// Hashing Password | During User CREATION
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(
    this.password as string,
    Number(config?.bcrypt_salt_rounds),
  );
  //this.passwordHistory = [this.password];
  next();
});

// Discarding Password and unnecessary fields | During User FIND
userSchema.pre('find', function (next) {
  this.projection({
    password: 0,
    passwordHistory: 0,
    createdAt: 0,
    updatedAt: 0,
  });
  next();
});

// -----------------------------
const User = model<IUser>('User', userSchema);

export default User;
