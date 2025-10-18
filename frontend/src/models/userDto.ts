import { RoleDTO } from "./roleDto";

export type UserDTO = {
    id: number;
    name: string;
    email: string;
    cpf: string;
    login: string;
    password?: string;
    roles: RoleDTO[];
};
