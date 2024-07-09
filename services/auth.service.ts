import { Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import { httpError, generateTokenAndSetCookie } from '../utils';
import { ILoginData, IRegisterData} from '../types/userTypes';

export const register = async (registerData: IRegisterData, res: Response) => {
  const user = await User.findOne({ email: registerData.email });

  if (user) {
    throw httpError({ status: 409, message: 'Email already use' })
  }

  const newUser = await User.create({
    ...registerData,
  })

  generateTokenAndSetCookie({ userId: newUser._id, res })

  return {
    status: 201,
    message: 'User created successfully!',
  };
};

export const login = async (loginData: ILoginData, res: Response) => {
  const user = await User.findOne({ email: loginData.email });

  if (!user) {
    throw httpError({ status: 400, message: 'Invalid username or password' });
  }

  const isPasswordCorrect = await bcrypt.compare(loginData.password, user.password);

  if (!isPasswordCorrect) {
    throw httpError({ status: 400, message: 'Invalid username or password' });
  }

  generateTokenAndSetCookie({ userId: user._id, res });

  return user;
};

export default {
    register,
    login,
  }