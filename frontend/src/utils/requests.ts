import axios, { AxiosRequestConfig } from "axios";
import { BASE_URL } from "./system";
import { history } from "./history";
import * as authService from "../services/auth-service";

export function requestBackend(config: AxiosRequestConfig) {
  const token = authService.getAccessToken();

  const headers = {
    ...config.headers,
    ...(token ? { Authorization: "Bearer " + token } : {})
  };

  return axios({
    ...config,
    baseURL: BASE_URL,
    headers,
    withCredentials: true // Sempre envia cookies (se o backend usar)
  });
}

axios.interceptors.request.use(
  function (config) {

    return config;
  },
  function (error) {
    
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {

    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      history.push("/login")
    }
    if (error.response.status === 403) {
      history.push("/home")
    }
    return Promise.reject(error);
  }
);