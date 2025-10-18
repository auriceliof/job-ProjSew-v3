import { AxiosRequestConfig } from "axios";
import { BASE_URL } from "../utils/system";
import { requestBackend } from "../utils/requests";
import { SupplierDTO } from "../models/supplierDto";

export function findPageRequest(page: number, name: string, size = 5, sort = "id") {
    const config : AxiosRequestConfig = {
        method: "GET",
        baseURL: BASE_URL,
        url: "/suppliers",
        params: {
            page,
            name,
            size,
            sort
        },
        withCredentials: true
    }

    return requestBackend(config)
}

export function findById(id: number) {
    const config : AxiosRequestConfig = {
        method: "GET",
        baseURL: BASE_URL,
        url: `/suppliers/${id}`,
        withCredentials: true
    }

    return requestBackend(config)
}

export function updateRequest(obj: SupplierDTO) {
    const config : AxiosRequestConfig = {
        method: "PUT",
        baseURL: BASE_URL,
        url: `/suppliers/${obj.id}`,
        data: obj,
        withCredentials: true
    }

    return requestBackend(config)
}

export function insertRequest(obj: SupplierDTO) {
    const config : AxiosRequestConfig = {
        method: "POST",
        baseURL: BASE_URL,
        url: "/suppliers",
        data: obj,
        withCredentials: true
    }

    return requestBackend(config)
}

export function deleteRequest(id: number) {
    const config : AxiosRequestConfig = {
        method: "DELETE",
        url: `/suppliers/${id}`,
        withCredentials: true
    }

    return requestBackend(config)
}
