import { AxiosRequestConfig } from "axios";
import { requestBackend } from "../utils/requests";
import { BASE_URL } from "../utils/system";
import { UserDTO } from "../models/userDto";

export function findMe() {
    const config: AxiosRequestConfig = {
        url: "/users/me",
        withCredentials: true
    };
    return requestBackend(config);
}

export function findPageRequest(page: number, name: string, size = 5, sort = "id") {
    const config: AxiosRequestConfig = {
        method: "GET",
        baseURL: BASE_URL,
        url: "/users",
        params: {
            page,
            name,
            size,
            sort
        },
        withCredentials: true
    };
    return requestBackend(config);
}

export function findById(id: number) {
    const config: AxiosRequestConfig = {
        method: "GET",
        baseURL: BASE_URL,
        url: `/users/${id}`,
        withCredentials: true
    };
    return requestBackend(config);
}

export function updateRequest(obj: UserDTO) {
    const config: AxiosRequestConfig = {
        method: "PUT",
        baseURL: BASE_URL,
        url: `/users/${obj.id}`,
        data: obj,
        withCredentials: true
    };
    return requestBackend(config);
}

export function insertRequest(obj: UserDTO) {
    const config: AxiosRequestConfig = {
        method: "POST",
        baseURL: BASE_URL,
        url: "/users",
        data: obj,
        withCredentials: true
    };
    return requestBackend(config);
}

export function deleteRequest(id: number) {
    const config: AxiosRequestConfig = {
        method: "DELETE",
        url: `/users/${id}`,
        withCredentials: true
    };
    return requestBackend(config);
}

export function findAllRoles() {
    const config: AxiosRequestConfig = {
        method: "GET",
        baseURL: BASE_URL,
        url: "/roles", 
        withCredentials: true
    };
    return requestBackend(config);
}
