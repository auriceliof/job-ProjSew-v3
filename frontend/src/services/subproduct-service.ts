import { AxiosRequestConfig } from "axios";
import { BASE_URL } from "../utils/system";
import { requestBackend } from "../utils/requests";
import { SubProductDTO } from "../models/subProductDto";

export function findPageRequest(page: number, name: string, size = 5, sort = "id") {
    const config : AxiosRequestConfig = {
        method: "GET",
        baseURL: BASE_URL,
        url: "/subproducts",
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
        url: `/subproducts/${id}`,
        withCredentials: true
    }

    return requestBackend(config)
}

export function updateRequest(obj: SubProductDTO) {
    const config : AxiosRequestConfig = {
        method: "PUT",
        baseURL: BASE_URL,
        url: `/subproducts/${obj.id}`,
        data: obj,
        withCredentials: true
    }

    return requestBackend(config)
}

export function insertRequest(obj: SubProductDTO) {
    const config : AxiosRequestConfig = {
        method: "POST",
        baseURL: BASE_URL,
        url: "/subproducts",
        data: obj,
        withCredentials: true
    }

    return requestBackend(config)
}

export function deleteRequest(id: number) {
    const config : AxiosRequestConfig = {
        method: "DELETE",
        url: `/subproducts/${id}`,
        withCredentials: true
    }

    return requestBackend(config)
}
