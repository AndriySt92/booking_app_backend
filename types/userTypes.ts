import { Document } from "mongoose"

export interface IUser extends Document {
  _id: string
  email: string
  password: string
  firstName: string
  lastName: string
  favorites: string[]
}

export interface IRegisterData extends Omit<IUser, '_id'> {}
export interface ILoginData extends Omit<IUser, '_id' | 'firstName' | 'lastName'> {}

export interface IRequest extends Request {
  user: IUser
  cookies: {
    auth_token: string
  } 
}

export interface IDecodedToken {
  userId: string
}

