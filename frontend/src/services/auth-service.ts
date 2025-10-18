import axios from "axios";
import QueryString from "qs";
import { AccessTokenPayloadDTO, CredentialsDTO, RoleEnum } from "../models/authDto";
import { CLIENT_ID, CLIENT_SECRET, BASE_URL } from "../utils/system";
import * as accessTokenRepository from "../localstorage/access-token-repository";
import jwtDecode from "jwt-decode";

//  LOGIN — usando axios direto (não requestBackend)
export function loginRequest(loginData: CredentialsDTO) {
  const headers = {
    "Content-type": "application/x-www-form-urlencoded",
    Authorization: "Basic " + window.btoa(CLIENT_ID + ":" + CLIENT_SECRET),
  };

  const requestBody = QueryString.stringify({
    ...loginData,
    grant_type: "password",
  });

  return axios({
    method: "POST",
    url: `${BASE_URL}/oauth2/token`,
    data: requestBody,
    headers: headers,
  });
}

//  TOKEN
export function logout() {
  accessTokenRepository.remove();
}

export function saveAccessToken(token: string) {
  accessTokenRepository.save(token);
}

export function getAccessToken() {
  return accessTokenRepository.get();
}

export function getAccessTokenPayload(): AccessTokenPayloadDTO | undefined {
  try {
    const token = accessTokenRepository.get();
    return token == null
      ? undefined
      : (jwtDecode(token) as AccessTokenPayloadDTO);
  } catch {
      return undefined;
  }
}

export function isAuthenticated(): boolean {
  let tokenPayload = getAccessTokenPayload();
  return tokenPayload && tokenPayload.exp * 1000 > Date.now() ? true : false;
}

export function hasAnyRoles(roles: RoleEnum[]): boolean {
  if (roles.length === 0) {
    return true;
  }

  const tokenPayload = getAccessTokenPayload();
  if (tokenPayload !== undefined) {
    for (var i = 0; i < roles.length; i++) {
      if (tokenPayload.authorities.includes(roles[i])) {
        return true;
      }
    }
  }
  return false;
}
