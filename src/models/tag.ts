import { ID, ObjectID } from "./id.ts";

export interface Tag {
  title: string;
  brief?: string;
  description?: string;
  img?: string;
  featured?: boolean;
  posts?: ID[];
}

export type TagDoc = ObjectID & Tag;
