import { User } from "./user.ts";
import { ObjectID } from "./id.ts";

export interface Post {
  title: string;
  brief?: string;
  description?: string;
  img?: string;
  featured?: boolean;
  author: User;
  cats?: ObjectID[];
  tags?: ObjectID[];
}

export type PostDoc = ObjectID & Post;
