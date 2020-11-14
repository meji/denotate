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
import { TagDoc, Tag as TagContent } from '../../models/tag.ts'
import { TagService } from '../../services/tag.service.ts'
import { isId } from '../../utils/index.ts'

@Controller()
export class TagController {
  constructor(private readonly service: TagService) {}

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
  async getTag(@Param('id') id: string, @Res() response: Response, @Req() request: Request) {
    if (!isId(id)) {
      return new NotFoundError('Tag Not Found...')
    }
    try {
      const document: TagDoc = await this.service.findTagById(id)

      if (document) {
        return Content(document, 200)
      }

      return new NotFoundError('Tag Not Found...')
    } catch (error) {
      console.log(error)

      throw new InternalServerError("Failure On 'findTagById' !")
    }
  }

  @Get('/byquery/')
  async getTagByQuery(
    @QueryParam('title') title: string,
    @QueryParam('id') id: string,
    @Res() response: Response,
    @Req() request: Request
  ) {
    if (!isId(id)) {
      return new NotFoundError('Tag Not Found...')
    }
    try {
      const documentName: TagDoc = await this.service.findTagByQuery(title)
      if (documentName) {
        return Content(documentName, 200)
      }
      const documentId: TagDoc = await this.service.findTagByQuery(id)
      if (documentId) {
        return Content(documentId, 200)
      }

      return new NotFoundError('Tag Not Found...')
    } catch (error) {
      console.log(error)

      throw new InternalServerError("Failure On 'findTagById' !")
    }
  }

  @Post('/')
  async addTag(@Body() body: TagContent) {
    try {
      if (Object.keys(body).length === 0) {
        return new BadRequestError('Body Is Empty...')
      }

      const id = await this.service.insertTag(body)
      const postF = await this.service.findTagById(id.$oid)
      return Content(postF, 201)
    } catch (error) {
      console.log(error)
      throw new InternalServerError("Failure On 'insertTag' !")
    }
  }

  @Put('/:id')
  async upTag(@Param('id') id: string, @Body() body: Partial<TagContent>) {
    if (!isId(id)) {
      return new NotFoundError('Tag Not Found...')
    }
    try {
      if (Object.keys(body).length === 0) {
        return new BadRequestError('Body Is Empty...')
      }

      const document: TagDoc = await this.service.findTagById(id)

      if (document) {
        const {
          _id: { $oid: updatedId }
        } = document
        const count = await this.service.updateTagById(id, body)

        if (count) {
          return { updatedId }
        }

        return Content({ message: 'Nothing Happened' }, 204)
      }

      return new NotFoundError('Vinyl Not Found...')
    } catch (error) {
      console.log(error)

      throw new InternalServerError("Failure On 'updateTagById' !")
    }
  }

  @Delete('/:id')
  async delTag(@Param('id') id: string) {
    try {
      const document: TagDoc = await this.service.findTagById(id)

      if (document) {
        const {
          _id: { $oid: deletedId }
        } = document
        const count = await this.service.deleteTagById(id)

        if (count) {
          return { deletedId }
        }

        return Content({ message: 'Nothing Happened' }, 204)
      }

      return new NotFoundError('Vinyl Not Found...')
    } catch (error) {
      console.log(error)

      throw new InternalServerError("Failure On 'deleteTagById' !")
    }
  }

  @Get('/:id/posts')
  async getPosts(@Param('id') id: string) {
    if (!isId(id)) {
      return new NotFoundError('Tag Not Found...')
    }
    try {
      return await this.service.getPostsFromTag(id)
    } catch (error) {
      console.log(error)
      throw new InternalServerError("Failure On 'getPosts' !")
    }
  }
}
