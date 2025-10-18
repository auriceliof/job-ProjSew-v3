import { AxiosRequestConfig } from "axios";
import { requestBackend } from "../utils/requests";
import { PayDTO } from "../models/payDto";

export function findPageRequest(page: number, name: string, size = 5, sort = "payDate,desc") {
    
    const config : AxiosRequestConfig = {
        method: "GET",
        url: "/payments",
        params: {
            page,
            name,
            size,
            sort,
        },
        withCredentials: true
    }

    return requestBackend(config)
}

export function findById(id: number) {
    const config : AxiosRequestConfig = {
        method: "GET",
        url: `/payments/${id}`,
        withCredentials: true
    }

    return requestBackend(config)
}

export function updateRequest(obj: PayDTO) {
    const config : AxiosRequestConfig = {
        method: "PUT",
        url: `/payments/${obj.id}`,
        data: obj,
        withCredentials: true
    }

    return requestBackend(config)
}

export function insertRequest(obj: PayDTO) {
    const config : AxiosRequestConfig = {
        method: "POST",
        url: "/payments",
        data: obj,
        withCredentials: true
    }

    return requestBackend(config)
}

export function deleteRequest(id: number) {
    const config : AxiosRequestConfig = {
        method: "DELETE",
        url: `/payments/${id}`,
        withCredentials: true
    }

    return requestBackend(config)
}
