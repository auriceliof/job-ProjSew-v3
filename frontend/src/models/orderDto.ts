import { ProductDTO } from "./productDto";
import { StatusDTO } from "./statusDto";
import { SubProductDTO } from "./subProductDto";
import { SupplierDTO } from "./supplierDto";

export type OrderDTO = {
    id: number,
    entryDate: Date,
    unitAmountProd: number,
    quantityProd: number,
    unitAmountSubProd: number,
    quantitySubProd: number,
    exitDate: Date,
    totalAmount: number,
    paidValue: number,
    isPaid: boolean,
    endOs: Date,
    status: StatusDTO,
    supplier: SupplierDTO,
    product: ProductDTO,
    subProduct: SubProductDTO | null,
};
