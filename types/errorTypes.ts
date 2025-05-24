export interface IHttpError {
  status: number
  message?: string
  stack?: string
}

export interface IErrorMessageList {
  [key: number]: string
}
