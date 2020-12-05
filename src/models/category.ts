import { ObjectID } from "./id.ts";

export interface Category {
  title: string;
  brief?: string;
  description?: string;
  img?: string;
  featured?: boolean;
  posts?: ObjectID[];
  categories?: Category[];
}

export type CategoryDoc = ObjectID & Category;
