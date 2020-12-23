import { Area } from "../../../deps.ts";
import { TagController } from "./tag.controller.ts";

@Area({
  baseRoute: "/tags",
  controllers: [TagController]
})
export class TagArea {}
