import { AxiosRequestConfig } from "axios";
import { requestBackend } from "../utils/requests";
import { OrderExitDTO } from "../models/orderExitDto";

export function findPageRequest(
  page: number,
  name?: string,
  size = 5,
  sort = "exitDate,asc",
  orderId?: number
) {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: "/exits",
    params: {
      page,
      size,
      sort,
      name,
      orderId, // agora envia o filtro correto
    },
    withCredentials: true,
  };

  return requestBackend(config);
}

export function findById(id: number) {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `/exits/${id}`,
    withCredentials: true,
  };
  return requestBackend(config);
}

export function updateRequest(obj: OrderExitDTO) {
  const config: AxiosRequestConfig = {
    method: "PUT",
    url: `/exits/${obj.id}`,
    data: obj,
    withCredentials: true,
  };
  return requestBackend(config);
}

export function insertRequest(obj: OrderExitDTO) {
  const config: AxiosRequestConfig = {
    method: "POST",
    url: "/exits",
    data: obj,
    withCredentials: true,
  };
  return requestBackend(config);
}

export function deleteRequest(id: number) {
  const config: AxiosRequestConfig = {
    method: "DELETE",
    url: `/exits/${id}`,
    withCredentials: true,
  };
  return requestBackend(config);
}
