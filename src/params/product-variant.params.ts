import { PageFilterParams } from "./page.params";
import { Status } from "@prisma/client";

export interface ProductVariantFilterParams extends PageFilterParams {
    productId?: number;
    status?: Status;
}
