import { ObjectID } from "./id.ts";

export interface User {
  login: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
  admin?: boolean;
  posts?: ObjectID[];
}
export interface UserWithoutPass {
  login: string;
  password?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  admin?: boolean;
  posts?: ObjectID[];
}

export type UserDocument = ObjectID & User;
export type UserDocumentWithoutPass = ObjectID & UserWithoutPass;
