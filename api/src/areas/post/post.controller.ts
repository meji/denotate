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
import { Post as PostContent, PostDoc } from '../../models/post.ts'
import { PostService } from '../../services/post.service.ts'
import { isId } from '../../utils/index.ts'

@Controller()
export class PostController {
  constructor(private readonly service: PostService) {}

  @Get()
  async getAllPostsByUser(
    @QueryParam('user') user: string,
    @Res() res: Response,
    @Req() req: Request
  ) {
    try {
      if (user) {
        return await this.service.findAllPostsByUser(user)
      }
    } catch (error) {
      console.log(error)
      throw new InternalServerError("Failure On 'findPostsByUser'!")
    }
  }

  @Get('/:id')
  async getPost(@Param('id') id: string, @Res() response: Response, @Req() request: Request) {
    if (!isId(id)) {
      return new NotFoundError('Post Not Found...')
    }
    try {
      const document: PostDoc = await this.service.findPostById(id)

      if (document) {
        return Content(document, 200)
      }

      return new NotFoundError('Post Not Found...')
    } catch (error) {
      console.log(error)

      throw new InternalServerError("Failure On 'findPostById' !")
    }
  }

  @Get('/byquery/')
  async getPostByQuery(
    @QueryParam('title') title: string,
    @QueryParam('id') id: string,
    @Res() response: Response,
    @Req() request: Request
  ) {
    if (!isId(id)) {
      return new NotFoundError('Post Not Found...')
    }
    try {
      const documentName: PostDoc = await this.service.findPostByQuery(title)
      if (documentName) {
        return Content(documentName, 200)
      }
      const documentId: PostDoc = await this.service.findPostByQuery(id)
      if (documentId) {
        return Content(documentId, 200)
      }

      return new NotFoundError('Post Not Found...')
    } catch (error) {
      console.log(error)

      throw new InternalServerError("Failure On 'findPostById' !")
    }
  }

  @Post('/')
  async addPost(@Body() body: PostContent) {
    try {
      if (Object.keys(body).length === 0) {
        return new BadRequestError('Body Is Empty...')
      }
      const id = await this.service.insertPost(body)
      const post = await this.service.findPostByIdO(id)
      return Content(post, 201)
    } catch (error) {
      console.log(error)
      throw new InternalServerError("Failure On 'insertPost' !")
    }
  }

  @Put('/:id')
  async upPost(@Param('id') id: string, @Body() body: Partial<PostContent>) {
    try {
      if (Object.keys(body).length === 0) {
        return new BadRequestError('Body Is Empty...')
      }

      const document: PostDoc = await this.service.findPostById(id)

      if (document) {
        const {
          _id: { $oid: updatedId }
        } = document
        const count = await this.service.updatePostById(id, body)

        if (count) {
          return { updatedId }
        }

        return Content({ message: 'Nothing Happened' }, 204)
      }

      return new NotFoundError('Vinyl Not Found...')
    } catch (error) {
      console.log(error)

      throw new InternalServerError("Failure On 'updatePostById' !")
    }
  }

  @Delete('/:id')
  async delPost(@Param('id') id: string) {
    try {
      const document: PostDoc = await this.service.findPostById(id)

      if (document) {
        const {
          _id: { $oid: deletedId }
        } = document
        const count = await this.service.deletePostById(id)

        if (count) {
          return { deletedId }
        }

        return Content({ message: 'Nothing Happened' }, 204)
      }

      return new NotFoundError('Vinyl Not Found...')
    } catch (error) {
      console.log(error)

      throw new InternalServerError("Failure On 'deletePostById' !")
    }
  }
}
