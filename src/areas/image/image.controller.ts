import {
  BadRequestError,
  Body,
  Content,
  Controller,
  Delete,
  ForbiddenError,
  Get,
  InternalServerError,
  NotFoundError,
  Param,
  Post,
  Put,
  QueryParam,
  Req,
  Request,
  Res,
  Response
} from "../../../deps.ts";
import { ImageService } from "../../services/image.service.ts";
import { Image as ImageContent } from "../../models/image.ts";
import { getUserFromToken } from "../../utils/verifyToken.ts";

@Controller()
export class ImageController {
  constructor(private readonly service: ImageService) {}

  @Post("/")
  async uploadImage(
    @Body() body: ImageContent,
    @Req() req: Request,
    @QueryParam("name") name: string
  ) {
    if ((await getUserFromToken(req.headers, false)) == false) {
      return Content(new ForbiddenError("Not Authorized"), 403);
    }
    try {
      if (Object.keys(body).length === 0) {
        return new BadRequestError("Body Is Empty...");
      }
      return await this.service.uploadImage(body, name);
    } catch (error) {
      console.log(error);
      throw new InternalServerError("Failure On 'uploadImage' !");
    }
  }

  // @Get("/:image")
  // async getImage(
  //   @Param("image") image: string,
  //   @Res() response: Response,
  //   @Req() request: Request
  // ) {
  //   try {
  //     const img = await this.service.getImage(image);
  //     const head = new Headers();
  //     head.set("Content-Type", "image");
  //     return Content({ body: img, headers: head }, 200);
  //   } catch (e) {
  //     return new InternalServerError(e);
  //   }
  // }
  @Delete("/:url")
  async deleteImage(
    @Res() response: Response,
    @Req() request: Request,
    @Param("url") url: string
  ) {
    await Deno.remove("./uploads/" + url);
    return Content({ body: { message: "Image deleted" }, status: 200 });
  }
}
