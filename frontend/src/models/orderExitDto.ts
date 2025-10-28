import { OrderDTO } from "./orderDto";

export type OrderExitDTO = {
    id: number,
    exitDate: Date,
    quantityProd: number,
    order: OrderDTO,
};
