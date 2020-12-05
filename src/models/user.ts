import { ObjectID } from "./id.ts";

export interface User {
  login: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  admin: boolean;
  posts: ObjectID[];
}

export type UserDocument = ObjectID & User;
