export interface PaginatedResponse {
  content: any[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}
