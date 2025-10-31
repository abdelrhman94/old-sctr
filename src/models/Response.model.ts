export interface PaginationResponse<T> {
  code: number;
  message: string;
  data: T[];
  totalRowsCount: number;
  pageNumber: number;
  pageSize: number;
  currentPage: number;
  numberOfPages: number;
}

export interface GeneralResponse<T> {
  code: number;
  message: string;
  data: T;
}
