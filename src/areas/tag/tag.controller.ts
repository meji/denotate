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
import { TagDoc, Tag as TagContent } from "../../models/tag.ts";
import { TagService } from "../../services/tag.service.ts";
import { isId } from "../../utils/index.ts";
import { getUserFromToken } from "../../utils/verifyToken.ts";
import { CategoryDoc } from "../../models/category.ts";
import { PostService } from "../../services/post.service.ts";

@Controller()
export class TagController {
  constructor(
    private readonly service: TagService,
    private readonly postService: PostService
  ) {}

  @Get("/")
  async getAllTagsByQuery(
    @QueryParam("user") user: string,
    @QueryParam("post") post: string,
    @QueryParam("title") title: string,
    @Res() res: Response,
    @Req() req: Request
  ) {
    try {
      if (isId(user) || isId(post) || title) {
        return await this.service.findAllTagsByQuery(user, post, title);
      } else {
        return await this.service.findAllTags();
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerError("Failure On 'findCategoriesByQuery'!");
    }
  }

  @Get("/:id")
  async getTag(
    @Param("id") id: string,
    @Res() response: Response,
    @Req() request: Request
  ) {
    if (!isId(id)) {
      return new NotFoundError("Tag Not Found...");
    }
    try {
      const document: TagDoc = await this.service.findTagById(id);

      if (document) {
        return Content(document, 200);
      }

      return new NotFoundError("Tag Not Found...");
    } catch (error) {
      console.log(error);

      throw new InternalServerError("Failure On 'findTagById' !");
    }
  }

  @Post("/")
  async addTag(@Body() body: TagContent, @Req() req: Request) {
    if ((await getUserFromToken(req.headers, false)) == false) {
      return Content(new ForbiddenError("Not Authorized"), 403);
    }
    try {
      if (Object.keys(body).length === 0) {
        return new BadRequestError("Body Is Empty...");
      }
      const docFind = await this.service.findAllTagsByQuery(
        undefined,
        undefined,
        body.title
      );
      if (docFind && docFind.length > 0) {
        return Content(new BadRequestError("Tag exists..."), 400);
      }
      const id = await this.service.insertTag(body);
      const tagF = await this.service.findTagById(id.$oid);
      return Content(tagF, 201);
    } catch (error) {
      console.log(error);
      throw new InternalServerError("Failure On 'insertTag' !");
    }
  }

  @Put("/:id")
  async upTag(
    @Param("id") id: string,
    @Body() body: Partial<TagContent>,
    @Req() req: Request
  ) {
    if ((await getUserFromToken(req.headers, false)) == false) {
      return Content(new ForbiddenError("Not Authorized"), 403);
    }
    if (!isId(id)) {
      return Content(
        "Not found",
        new NotFoundError("Body Empty...").httpCode || 404
      );
    }
    try {
      if (Object.keys(body).length === 0) {
        return Content(
          "Not found",
          new NotFoundError("Body Empty...").httpCode || 202
        );
      }

      const document: TagDoc = await this.service.findTagById(id);

      if (document) {
        const {
          _id: { $oid: updatedId }
        } = document;
        const count = await this.service.updateTagById(id, body);
        const tagModified: CategoryDoc = await this.service.findTagById(
          updatedId
        );

        if (count && tagModified) {
          return Content(tagModified, 200);
        }

        return Content({ message: "Nothing Happened" }, 204);
      }

      return new NotFoundError("Tag Not Found...");
    } catch (error) {
      console.log(error);

      throw new InternalServerError("Failure On 'updateTagById' !");
    }
  }

  @Delete("/:id")
  async delTag(@Param("id") id: string, @Req() req: Request) {
    if ((await getUserFromToken(req.headers, false)) == false) {
      return Content(new ForbiddenError("Not Authorized"), 403);
    }
    try {
      const document: TagDoc = await this.service.findTagById(id);

      if (document) {
        const {
          _id: { $oid: deletedId }
        } = document;
        const count = await this.service.deleteTagById(id);

        if (count) {
          const posts = document.posts;
          if (posts) {
            posts.map(postId => {
              this.postService.deleteTagFromPost(postId.$oid, deletedId);
            });
          }

          return document;
        }

        return Content({ message: "Nothing Happened" }, 204);
      }

      return new NotFoundError("Tag Not Found...");
    } catch (error) {
      console.log(error);

      throw new InternalServerError("Failure On 'deleteTagById' !");
    }
  }

  @Get("/:id/posts")
  async getPosts(@Param("id") id: string) {
    if (!isId(id)) {
      return new NotFoundError("Tag Not Found...");
    }
    try {
      return await this.service.getPostsFromTag(id);
    } catch (error) {
      console.log(error);
      throw new InternalServerError("Failure On 'getPosts' !");
    }
  }
}
