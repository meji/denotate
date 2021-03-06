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
import { Post as PostContent, PostDoc } from "../../models/post.ts";
import { PostService } from "../../services/post.service.ts";
import { isId } from "../../utils/index.ts";
import { getUserFromToken } from "../../utils/verifyToken.ts";
import { CategoryService } from "../../services/category.service.ts";

@Controller()
export class PostController {
  constructor(
    private readonly service: PostService,
    private readonly serviceCategory: CategoryService
  ) {}
  @Get("/")
  async getAllPostsByQuery(
    @QueryParam("user") user: string,
    @QueryParam("cat") cat: string,
    @QueryParam("tag") tag: string,
    @QueryParam("title") title: string,
    @Res() res: Response,
    @Req() req: Request
  ) {
    try {
      if (isId(user) || isId(cat) || tag || title) {
        return await this.service.findAllPostsByQuery(user, cat, tag, title);
      } else {
        return await this.service.findAllPosts();
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerError("Failure On 'findPostsByUser'!");
    }
  }

  @Get("/:id")
  async getPost(
    @Param("id") id: string,
    @Res() response: Response,
    @Req() request: Request
  ) {
    if (!isId(id)) {
      return new NotFoundError("Post Not Found...");
    }
    try {
      const document: PostDoc = await this.service.findPostById(id);

      if (document) {
        return Content(document, 200);
      }

      return new NotFoundError("Post Not Found...");
    } catch (error) {
      console.log(error);

      throw new InternalServerError("Failure On 'findPostById' !");
    }
  }

  @Post("/")
  async addPost(@Body() body: PostContent, @Req() req: Request) {
    if ((await getUserFromToken(req.headers, false)) == false) {
      return Content(new ForbiddenError("Not Authorized"), 403);
    }
    const author = await getUserFromToken(req.headers);
    let content;
    if (author) {
      content = { ...body, author: author._id };
    } else {
      content = body;
    }
    try {
      if (Object.keys(body).length === 0) {
        return Content(new BadRequestError("Body Is Empty..."), 400);
      }
      const docFind = await this.service.findPostByTitle(body.title);
      if (docFind) {
        return Content(new BadRequestError("Post exists..."), 400);
      }
      const id = await this.service.insertPost(content);
      const postF = await this.service.findPostById(id.$oid);

      const categories = postF.cats;
      if (categories) {
        categories.map(categoryId => {
          this.serviceCategory.updatePostInCategory(categoryId.$oid, {
            $oid: postF._id.$oid
          });
        });
      }

      return Content(postF, 201);
    } catch (error) {
      console.log(error);
      throw new InternalServerError("Failure On 'insertPost' !");
    }
  }

  @Put("/:id")
  async upPost(
    @Param("id") id: string,
    @Body() body: Partial<PostContent>,
    @Req() req: Request
  ) {
    if ((await getUserFromToken(req.headers, false)) == false) {
      return Content(new ForbiddenError("Not Authorized"), 403);
    }
    if (!isId(id)) {
      return new NotFoundError("Post Not Found...");
    }
    try {
      if (Object.keys(body).length === 0) {
        return new BadRequestError("Body Is Empty...");
      }

      const document: PostDoc = await this.service.findPostById(id);

      if (document) {
        const {
          _id: { $oid: updatedId }
        } = document;
        const count = await this.service.updatePostById(id, body);
        if (count) {
          const modifiedOne = await this.service.findPostById(id);
          const newCats = modifiedOne.cats ? modifiedOne.cats : [];
          const newTags = modifiedOne.cats ? modifiedOne.cats : [];

          if (document.cats && modifiedOne) {
            document.cats
              .filter(cat => !newCats.includes(cat))
              .map(cat =>
                this.serviceCategory.deletePostInCategory(cat.$oid, {
                  $oid: id
                })
              );
          }
          const categories = modifiedOne.cats;
          if (categories) {
            categories.map(categoryId => {
              this.serviceCategory.updatePostInCategory(categoryId.$oid, {
                $oid: modifiedOne._id.$oid
              });
            });
          }
          return this.service.findPostById(updatedId);
        }
        return Content({ message: "Nothing Happened" }, 204);
      }

      return new NotFoundError("Vinyl Not Found...");
    } catch (error) {
      console.log(error);

      throw new InternalServerError("Failure On 'updatePostById' !");
    }
  }

  @Delete("/:id")
  async delPost(@Param("id") id: string, @Req() req: Request) {
    if ((await getUserFromToken(req.headers, false)) == false) {
      return Content(new ForbiddenError("Not Authorized"), 403);
    }
    try {
      const document: PostDoc = await this.service.findPostById(id);

      if (document) {
        const {
          _id: { $oid: deletedId }
        } = document;
        const count = await this.service.deletePostById(id);
        const categories = document.cats;
        if (categories) {
          categories.map(categoryId => {
            this.serviceCategory.deletePostInCategory(categoryId.$oid, {
              $oid: document._id.$oid
            });
          });
        }
        if (count) {
          return document;
        }

        return Content({ message: "Nothing Happened" }, 204);
      }

      return new NotFoundError("Post Not Found...");
    } catch (error) {
      console.log(error);
      throw new InternalServerError("Failure On 'deletePostById' !");
    }
  }

  @Get("/bytag/:tag")
  async getAllPostsByTag(
    @Param("tag") tag: string,
    @Res() res: Response,
    @Req() req: Request
  ) {
    try {
      if (tag) {
        return await this.service.findAllpostsByTag(tag);
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerError("Failure On 'findPostsByTag'!");
    }
  }
  @Get("/tags")
  async getAllTags(@Res() res: Response, @Req() req: Request) {
    try {
      return await this.service.findAlltags();
    } catch (error) {
      console.log(error);
      throw new InternalServerError("Failure On 'findAllTags'!");
    }
  }
}
