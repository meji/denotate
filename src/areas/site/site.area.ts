import { Area } from "../../../deps.ts";
import { SiteController } from "./site.controller.ts";

@Area({
  baseRoute: "/site",
  controllers: [SiteController]
})
export class TagArea {}
