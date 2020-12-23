import { Area } from "../../../deps.ts";
import { CategoryController } from "./category.controller.ts";

@Area({
  baseRoute: "/categories",
  controllers: [CategoryController]
})
export class CategoryArea {}
