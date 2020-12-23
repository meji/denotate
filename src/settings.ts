import { AppSettings } from "../deps.ts";
import { PostArea } from "./areas/post/post.area.ts";
import { Log } from "./middlewares/log.middleware.ts";
import { TagArea } from "./areas/tag/tag.area.ts";
import { CategoryArea } from "./areas/category/category.area.ts";
import { UserArea } from "./areas/user/user.area.ts";
import { ImageArea } from "./areas/image/image.area.ts";
import { SiteArea } from "./areas/site/site.area.ts";

export const appSettings: AppSettings = {
  areas: [PostArea, CategoryArea, TagArea, UserArea, ImageArea, SiteArea],
  middlewares: [Log],
  logging: true
};
