import { PageFilterParams } from "./page.params";
import { Status } from "@prisma/client";

export interface ProductAttributeFilterParams extends PageFilterParams {
    productId?: number;
    attributeId?: number;
    status?: Status;
}
