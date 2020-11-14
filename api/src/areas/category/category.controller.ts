import {
  BadRequestError,
  Body,
  Content,
  Controller,
  Delete,
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
} from '../../../deps.ts'
import { CategoryDoc, Category as CategoryContent } from '../../models/category.ts'
import { CategoryService } from '../../services/category.service.ts'
import { isId } from '../../utils/index.ts'

@Controller()
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Get()
  async getAllCategoriesByUser(
    @QueryParam('user') user: string,
    @Res() res: Response,
    @Req() req: Request
  ) {
    try {
      if (user) {
        return await this.service.findAllCategoriesByUser(user)
      }
    } catch (error) {
      console.log(error)
      throw new InternalServerError("Failure On 'findCategoriesByUser'!")
    }
  }

  @Get('/:id')
  async getCategory(@Param('id') id: string, @Res() response: Response, @Req() request: Request) {
    if (!isId(id)) {
      return new NotFoundError('Category Not Found...')
    }
    try {
      const document: CategoryDoc = await this.service.findCategoryById(id)

      if (document) {
        return Content(document, 200)
      }

      return new NotFoundError('Category Not Found...')
    } catch (error) {
      console.log(error)

      throw new InternalServerError("Failure On 'findCategoryById' !")
    }
  }

  @Get('/byquery/')
  async getCategoryByQuery(
    @QueryParam('title') title: string,
    @QueryParam('id') id: string,
    @Res() response: Response,
    @Req() request: Request
  ) {
    if (!isId(id)) {
      return new NotFoundError('Category Not Found...')
    }
    try {
      const documentName: CategoryDoc = await this.service.findCategoryByQuery(title)
      if (documentName) {
        return Content(documentName, 200)
      }
      const documentId: CategoryDoc = await this.service.findCategoryByQuery(id)
      if (documentId) {
        return Content(documentId, 200)
      }

      return new NotFoundError('Category Not Found...')
    } catch (error) {
      console.log(error)

      throw new InternalServerError("Failure On 'findCategoryById' !")
    }
  }

  @Post('/')
  async addCategory(@Body() body: CategoryContent) {
    try {
      if (Object.keys(body).length === 0) {
        return new BadRequestError('Body Is Empty...')
      }

      const id = await this.service.insertCategory(body)
      const postF = await this.service.findCategoryById(id.$oid)
      return Content(postF, 201)
    } catch (error) {
      console.log(error)
      throw new InternalServerError("Failure On 'insertCategory' !")
    }
  }

  @Put('/:id')
  async upCategory(@Param('id') id: string, @Body() body: Partial<CategoryContent>) {
    if (!isId(id)) {
      return new NotFoundError('Category Not Found...')
    }
    try {
      if (Object.keys(body).length === 0) {
        return new BadRequestError('Body Is Empty...')
      }

      const document: CategoryDoc = await this.service.findCategoryById(id)

      if (document) {
        const {
          _id: { $oid: updatedId }
        } = document
        const count = await this.service.updateCategoryById(id, body)

        if (count) {
          return { updatedId }
        }

        return Content({ message: 'Nothing Happened' }, 204)
      }

      return new NotFoundError('Vinyl Not Found...')
    } catch (error) {
      console.log(error)

      throw new InternalServerError("Failure On 'updateCategoryById' !")
    }
  }

  @Delete('/:id')
  async delCategory(@Param('id') id: string) {
    try {
      const document: CategoryDoc = await this.service.findCategoryById(id)

      if (document) {
        const {
          _id: { $oid: deletedId }
        } = document
        const count = await this.service.deleteCategoryById(id)

        if (count) {
          return { deletedId }
        }

        return Content({ message: 'Nothing Happened' }, 204)
      }

      return new NotFoundError('Vinyl Not Found...')
    } catch (error) {
      console.log(error)

      throw new InternalServerError("Failure On 'deleteCategoryById' !")
    }
  }

  @Get('/:id/posts')
  async getPosts(@Param('id') id: string) {
    if (!isId(id)) {
      return new NotFoundError('Category Not Found...')
    }
    try {
      return await this.service.getPostsFromCategory(id)
    } catch (error) {
      console.log(error)
      throw new InternalServerError("Failure On 'getPosts' !")
    }
  }
}
