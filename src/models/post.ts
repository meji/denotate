import { User } from "./user.ts";
import { ID, ObjectID } from "./id.ts";

export interface Post {
  title: string;
  brief?: string;
  description?: string;
  img?: string;
  featured?: boolean;
  author: User;
  cats?: ID[];
  tags?: ID[];
}

export type PostDoc = ObjectID & Post;
