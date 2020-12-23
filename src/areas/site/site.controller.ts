import {
  BadRequestError,
  Body,
  Content,
  Controller,
  ForbiddenError,
  Get,
  InternalServerError,
  Post,
  Put,
  Req,
  Request,
  Res,
  Response
} from "../../../deps.ts";

import { SiteService } from "../../services/site.service.ts";
import { getUserFromToken } from "../../utils/verifyToken.ts";
import { Site } from "../../models/site.ts";

@Controller()
export class SiteController {
  constructor(private readonly service: SiteService) {}

  @Get("/")
  async getSiteData(@Res() res: Response, @Req() req: Request) {
    try {
      return await this.service.getSiteData();
    } catch (error) {
      console.log(error);
      throw new InternalServerError("Failure On 'findCategoriesByQuery'!");
    }
  }
  @Post("/")
  async addSiteData(@Body() body: Partial<Site>, @Req() req: Request) {
    try {
      if (Object.keys(body).length === 0) {
        return new BadRequestError("Body Is Empty...");
      }
      const isSiteSetted = await this.service.getSiteData();
      if (isSiteSetted) {
        return Content(new BadRequestError("Site exists..."), 400);
      }
      const site = await this.service.createSiteData(body);
      if (site) {
        const siteData = await this.service.getSiteData();
        return Content(siteData, 201);
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerError("Failure On create Site!");
    }
  }
  @Put("/")
  async updateSiteData(@Body() body: Partial<Site>, @Req() req: Request) {
    if ((await getUserFromToken(req.headers, true)) == false) {
      return Content(new ForbiddenError("Not Authorized"), 403);
    }
    try {
      if (Object.keys(body).length === 0) {
        return new BadRequestError("Body Is Empty...");
      }
      const site = await this.service.updateSiteData(body);
      return Content(site, 201);
    } catch (error) {
      console.log(error);
      throw new InternalServerError("Failure On create Site!");
    }
  }
}
