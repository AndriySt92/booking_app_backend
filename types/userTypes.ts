export interface IUser {
  _id: string
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface IRequest extends Request {
  user: IUser
  cookies: {
    auth_token: string
  } 
}

export interface IAuthRequest {
  body: IUser
  user?: IUser
}

export interface IDecodedToken {
  userId: string
}
