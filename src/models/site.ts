import { ID, ObjectID } from "./id.ts";

export interface Site {
  title: string;
  brief: string;
  logo: string;
  color: string;
  database: string;
}

export type SiteDoc = ObjectID & Site;
