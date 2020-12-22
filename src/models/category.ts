import { ID, ObjectID } from "./id.ts";

export interface Category {
  title: string;
  brief?: string;
  description?: string;
  img?: string;
  featured?: boolean;
  posts?: ID[];
  cats?: ID[];
}

export type CategoryDoc = ObjectID & Category;
