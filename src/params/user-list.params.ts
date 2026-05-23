import { PaginationParams } from './pagination.params';

export interface UserListParams extends PaginationParams {
  status?: string | null;
  endDate?: string | null;
}
