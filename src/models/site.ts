import { ObjectID } from "./id.ts";

export interface Site {
  title: string;
  brief: string;
  logo: string;
  color: string;
  new: boolean;
}

export type SiteDoc = ObjectID & Site;
