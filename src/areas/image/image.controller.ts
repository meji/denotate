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
  async uploadImage(@Body() body: ImageContent, @Req() req: Request) {
    if ((await getUserFromToken(req.headers, false)) == false) {
      return Content(new ForbiddenError("Not Authorized"), 403);
    }
    try {
      if (Object.keys(body).length === 0) {
        return new BadRequestError("Body Is Empty...");
      }
      return await this.service.uploadImage(body);
    } catch (error) {
      console.log(error);
      throw new InternalServerError("Failure On 'uploadImage' !");
    }
  }

  @Get("/:url")
  async getImage(
    @Param("id") id: string,
    @Res() response: Response,
    @Req() request: Request
  ) {
    const img = await Deno.readFile("./uploads/cat.png");
    const head = new Headers();
    head.set("content-type", "image/png");
    Content({ headers: head, body: img, status: 200 });
  }
}
