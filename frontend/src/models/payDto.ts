import { OrderDTO } from "./orderDto";

export type PayDTO = {
    id: number,
    payDate: Date,
    payValue: number,
    order: OrderDTO,
};
