import { AxiosRequestConfig } from "axios";
import { requestBackend } from "../utils/requests";
import { ProductDTO } from "../models/productDto";

export function findPageRequest(page: number, name: string, size = 5, sort = "id") {
    const config : AxiosRequestConfig = {
        method: "GET",
        url: "/products",
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
        url: `/products/${id}`,
        withCredentials: true
    }
    
    return requestBackend(config)    
}

export function updateRequest(obj: ProductDTO) {
    const config : AxiosRequestConfig = {
        method: "PUT",
        url: `/products/${obj.id}`,
        data: obj,
        withCredentials: true
    }    

    return requestBackend(config)
}

export function insertRequest(obj: ProductDTO) {
    const config : AxiosRequestConfig = {
        method: "POST",
        url: "/products",
        data: obj,
        withCredentials: true
    } 

    return requestBackend(config)
}

export function deleteRequest(id: number) {
    const config : AxiosRequestConfig = {
        method: "DELETE",
        url: `/products/${id}`,
        withCredentials: true
    }

    return requestBackend(config)
}
