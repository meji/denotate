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
  Response,
  verify
} from "../../../deps.ts";
import {
  CategoryDoc,
  Category as CategoryContent
} from "../../models/category.ts";
import { CategoryService } from "../../services/category.service.ts";
import { getUserFromToken } from "../../utils/verifyToken.ts";
import { isId } from "../../utils/index.ts";
import { PostService } from "../../services/post.service.ts";

@Controller()
export class CategoryController {
  constructor(
    private readonly service: CategoryService,
    private readonly postService: PostService
  ) {}
  @Get("/")
  async getAllCategoriesByQuery(
    @QueryParam("user") user: string,
    @QueryParam("cat") cat: string,
    @QueryParam("post") post: string,
    @QueryParam("title") title: string,
    @Res() res: Response,
    @Req() req: Request
  ) {
    try {
      if (isId(user) || isId(cat) || isId(post) || title) {
        return await this.service.findAllCategoriesByQuery(
          user,
          cat,
          post,
          title
        );
      } else {
        return await this.service.findAllCategories();
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerError("Failure On 'findCategoriesByQuery'!");
    }
  }
  @Get("/:id")
  async getCategory(
    @Param("id") id: string,
    @Res() response: Response,
    @Req() request: Request
  ) {
    if (!isId(id)) {
      return new NotFoundError("Category Not Found...");
    }
    try {
      const document: CategoryDoc = await this.service.findCategoryById(id);

      if (document) {
        return Content(document, 200);
      }

      return new NotFoundError("Category Not Found...");
    } catch (error) {
      console.log(error);

      throw new InternalServerError("Failure On 'findCategoryById' !");
    }
  }

  @Post("/")
  async addCategory(@Body() body: CategoryContent, @Req() req: Request) {
    if ((await getUserFromToken(req.headers, true)) == false) {
      return Content(new ForbiddenError("Not Authorized"), 403);
    }
    try {
      if (Object.keys(body).length === 0) {
        return new BadRequestError("Body Is Empty...");
      }
      const docFind = await this.service.findAllCategoriesByQuery(
        undefined,
        undefined,
        undefined,
        body.title
      );
      if (docFind && docFind.length > 0) {
        return Content(new BadRequestError("Category exists..."), 400);
      }
      const id = await this.service.insertCategory(body);
      const catF = await this.service.findCategoryById(id.$oid);
      return Content(catF, 201);
    } catch (error) {
      console.log(error);
      throw new InternalServerError("Failure On 'insertCategory' !");
    }
  }

  @Put("/:id")
  async upCategory(
    @Param("id") id: string,
    @Body() body: Partial<CategoryContent>,
    @Req() req: Request
  ) {
    if ((await getUserFromToken(req.headers, true)) == false) {
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

      const document: CategoryDoc = await this.service.findCategoryById(id);

      if (document) {
        const {
          _id: { $oid: updatedId }
        } = document;
        const count = await this.service.updateCategoryById(updatedId, body);
        const catModified: CategoryDoc = await this.service.findCategoryById(
          updatedId
        );

        if (count && catModified) {
          return Content(catModified, 200);
        }
        return Content({ message: "Nothing Happened" }, 204);
      }

      return new NotFoundError("Category Not Found...");
    } catch (error) {
      console.log(error);

      throw new InternalServerError("Failure On 'updateCategoryById' !");
    }
  }

  @Delete("/:id")
  async delCategory(@Param("id") id: string, @Req() req: Request) {
    if ((await getUserFromToken(req.headers, true)) == false) {
      return Content(new ForbiddenError("Not Authorized"), 403);
    }
    try {
      const document: CategoryDoc = await this.service.findCategoryById(id);

      if (document) {
        const {
          _id: { $oid: deletedId }
        } = document;
        const count = await this.service.deleteCategoryById(id);

        if (count) {
          const categories = document.cats;
          const posts = document.posts;
          if (categories) {
            categories.map(categoryId => {
              this.service.deleteCategoryById(categoryId.$oid);
            });
          } else if (posts) {
            posts.map(postId => {
              this.postService.deleteCategoryFromPost(postId.$oid, deletedId);
            });
          }

          return document;
        }

        return Content({ message: "Nothing Happened" }, 204);
      }

      return Content(
        "Not found",
        new NotFoundError("Not Found...").httpCode || 404
      );
    } catch (error) {
      console.log(error);

      throw new InternalServerError("Failure On 'deleteCategoryById' !");
    }
  }

  @Get("/:id/posts")
  async getPosts(@Param("id") id: string) {
    if (!isId(id)) {
      return Content(
        "Not found",
        new NotFoundError("Not Found...").httpCode || 404
      );
    }
    try {
      return await this.service.getPostsFromCategory(id);
    } catch (error) {
      console.log(error);
      throw new InternalServerError("Failure On 'getPosts' !");
    }
  }
}
