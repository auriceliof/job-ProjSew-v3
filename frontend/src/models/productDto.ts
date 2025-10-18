import { SubProductDTO } from "./subProductDto";

export type ProductDTO = {
    id: number,
    name: string,
    description: string,
    hasSubProd: boolean,
    subProduct: SubProductDTO
};
