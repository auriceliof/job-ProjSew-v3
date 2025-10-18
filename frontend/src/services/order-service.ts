import { AxiosRequestConfig } from "axios";
import { requestBackend } from "../utils/requests";
import { OrderDTO } from "../models/orderDto";

export function findPageRequest(page: number, name: string, statusId: number | null, productId: number | null, size = 5, sort = "entryDate,desc") {
    
    const config : AxiosRequestConfig = {
        method: "GET",
        url: "/orders",
        params: {
            page,
            name,
            size,
            sort,
            statusId,
            productId 
        },
        withCredentials: true,
    }

    return requestBackend(config)
}

export function findById(id: number) {
  // se o ID for inválido, rejeita imediatamente sem chamar o backend
  if (!Number.isFinite(id) || id <= 0) {
    return Promise.reject(new Error(`ID inválido para busca: ${id}`));
  }

  const config: AxiosRequestConfig = {
    method: "GET",
    url: `/orders/${id}`,
    withCredentials: true,
  };

  return requestBackend(config);
}

export function updateRequest(obj: OrderDTO) {
    const config : AxiosRequestConfig = {
        method: "PUT",
        url: `/orders/${obj.id}`,
        data: obj,
        withCredentials: true,
    }

    return requestBackend(config)
}

export function insertRequest(obj: OrderDTO) {
    const config : AxiosRequestConfig = {
        method: "POST",
        url: "/orders",
        data: obj,
        withCredentials: true,
    }

    return requestBackend(config)
}

export function deleteRequest(id: number) {
    const config : AxiosRequestConfig = {
        method: "DELETE",
        url: `/orders/${id}`,
        withCredentials: true,
    }

    return requestBackend(config)
}
