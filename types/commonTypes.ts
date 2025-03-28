export interface IPaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    pages: number
  }
}
