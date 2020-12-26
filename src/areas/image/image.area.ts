import { Area } from "../../../deps.ts";
import { ImageController } from "./image.controller.ts";

@Area({
  baseRoute: "/images",
  controllers: [ImageController]
})
export class ImageArea {}
