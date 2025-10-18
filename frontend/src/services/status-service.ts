import { AxiosRequestConfig } from "axios";
import { requestBackend } from "../utils/requests";
import { StatusDTO } from "../models/statusDto";

export function findPageRequest(page: number, name: string, size = 5, sort = "id") {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: "/status",
    params: { page, name, size, sort },
    withCredentials: true
  };
  return requestBackend(config);
}

export function findById(id: number) {
  return requestBackend({
    method: "GET",
    url: `/status/${id}`,
    withCredentials: true
  });
}

export function updateRequest(obj: StatusDTO) {
  return requestBackend({
    method: "PUT",
    url: `/status/${obj.id}`,
    data: obj,
    withCredentials: true
  });
}

export function insertRequest(obj: StatusDTO) {
  return requestBackend({
    method: "POST",
    url: "/status",
    data: obj,
    withCredentials: true
  });
}

export function deleteRequest(id: number) {
  return requestBackend({
    method: "DELETE",
    url: `/status/${id}`,
    withCredentials: true
  });
}
