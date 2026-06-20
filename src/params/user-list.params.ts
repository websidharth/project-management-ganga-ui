import { PageFilterParams } from "./page.params";

 

export interface UserListParams extends PageFilterParams {
  status?: string | null;
  storeCode?: string;
  storeId?: number;
}
