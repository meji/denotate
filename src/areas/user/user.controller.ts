import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Req,
  Body,
  Content,
  InternalServerError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  ServerRequest,
  genSalt,
  hash,
  compare,
  create,
  verify,
  Request,
  Param
} from '../../../deps.ts'
import { User, UserDocument } from '../../models/user.ts'
import { UserService } from '../../services/user.service.ts'
import { TokenService } from '../../services/token.service.ts'
import env from '../../config/env.ts'
import { isEmpty, convertBearerToToken } from '../../utils/index.ts'
import { getUserFromToken } from '../../utils/verifyToken.ts'

type StringOrNull = string | null

@Controller()
export class UserController {
  constructor(private userService: UserService, private tokenService: TokenService) {}

  /**
   * Verify Authorization
   *
   * @param {Headers} headers Headers (Authorization)
   * @param {Boolean} isLogout Is Logout (Default: 'false')
   * @returns {StringOrNull} Issuer
   */
  private async verifyAuth(headers: Headers, isLogout = false): Promise<StringOrNull> {
    const bearer = headers.get('authorization')

    if (!bearer) {
      return null
    }

    const [token, header, payload, signature] = convertBearerToToken(bearer)

    const allTokens = await this.tokenService.findAllTokens()

    const tokens = allTokens.map(
      ({ header, payload, signature }) => `${header}.${payload}.${signature}`
    )

    if (tokens.includes(token)) {
      return null
    }

    const jwt = await verify(token, env.secret, 'HS512')

    if (!jwt || !jwt.iss || !jwt.exp || jwt.exp < new Date().getTime()) {
      return null
    }

    if (isLogout) {
      await this.tokenService.insertToken({
        header,
        payload,
        signature,
        exp: jwt.exp
      })
    }
    return jwt.iss
  }

  @Post('/')
  async registerUser(@Body() body: User, @Req() req: Request) {
    try {
      if (isEmpty(body)) {
        return new BadRequestError('Body Is Empty...')
      }

      const { password, ...user } = body

      const newSalt = await genSalt(10)
      const hashedPswd = await hash(password, newSalt)

      const { $oid: id } = await this.userService.insertUser({
        password: hashedPswd,
        ...user
      })

      const token = await create(
        { alg: 'HS512', typ: 'JWT' },
        { iss: id, exp: new Date().getTime() + 60 * 60 * 6 * 1000 },
        env.secret
      )
      return { token }
    } catch (error) {
      console.log(error)

      throw new InternalServerError("Failure On 'insertUser'")
    }
  }

  @Post('/new')
  async registerNewUser(@Body() body: User, @Req() req: Request) {
    if ((await getUserFromToken(req.headers, true)) == false) {
      return Content(new ForbiddenError('Not Authorized'), 403)
    }
    try {
      if (isEmpty(body)) {
        return new BadRequestError('Body Is Empty...')
      }
      if (
        (await this.userService.findUserByLogin(body.login)) ||
        (await this.userService.findUserByEmail(body.login))
      ) {
        return Content({ message: 'User does exist' }, 409)
      }

      const { password, ...user } = body

      const newSalt = await genSalt(10)
      const hashedPswd = await hash(password, newSalt)

      const { $oid: id } = await this.userService.insertUser({
        password: hashedPswd,
        ...user
      })

      return Content(id, 200)
    } catch (error) {
      console.log(error)

      throw new InternalServerError("Failure On 'insertUser'")
    }
  }

  @Post('/login')
  async loginUser(@Body() body: { login: string; password: string }) {
    try {
      if (isEmpty(body)) {
        return new BadRequestError('Body Is Empty...')
      }

      const { login, password } = body

      const {
        _id: { $oid: id },
        ...document
      } = await this.userService.findUserByLogin(login)

      if (document && document.password) {
        const comparedPswd = await compare(password, document.password)
        if (comparedPswd) {
          const token = await create(
            { alg: 'HS512', typ: 'JWT' },
            { iss: id, exp: new Date().getTime() + 60 * 60 * 6 * 1000 },
            env.secret
          )
          return { token }
        }
        return new UnauthorizedError('Not authorized')
      }

      return new NotFoundError('User Not Found...')
    } catch (error) {
      console.log(error)

      throw new InternalServerError("Failure On 'findUserByLogin'")
    }
  }

  @Get('/logout')
  async logoutUser(@Req() req: ServerRequest) {
    try {
      const iss = await this.verifyAuth(req.headers, true)

      if (!iss) {
        return new ForbiddenError('Nope...')
      }

      const document = await this.userService.findUserById(iss)

      if (document) {
        return null
      }

      return new NotFoundError('User Not Found...')
    } catch (error) {
      console.log(error)

      throw new InternalServerError("Failure On 'findUserById'")
    }
  }

  @Get('/all')
  async getAllUsers(@Req() req: Request) {
    if ((await getUserFromToken(req.headers, true)) == false) {
      return Content(new ForbiddenError('Not Authorized'), 403)
    }
    try {
      const documents: UserDocument[] = await this.userService.findAllUsers()
      return documents.map(user => {
        return { ...user, password: '' }
      })
    } catch (error) {
      console.log(error)

      throw new InternalServerError("Failure On 'findAllUsers'")
    }
  }

  @Get('/isadmin')
  async isAdmin(@Req() req: ServerRequest) {
    try {
      if (await this.userService.findAdmin()) {
        return Content(true, 200)
      } else {
        return Content(false, 403)
      }
    } catch (e) {
      console.log(e)
    }
  }

  @Get('/:userid')
  async getUser(@Req() req: ServerRequest, @Param('userid') userid: string) {
    if ((await getUserFromToken(req.headers, false)) == false) {
      return Content(new ForbiddenError('Not Authorized'), 403)
    }

    try {
      const iss = await this.verifyAuth(req.headers)
      if (!iss) {
        return new ForbiddenError('Nope...')
      }

      const {
        password,
        _id: { $oid: id },
        ...document
      } = await this.userService.findUserById(userid ? userid : iss)

      if (document) {
        return { _id: { $oid: id }, ...document }
      }

      return new NotFoundError('User Not Found...')
    } catch (error) {
      console.log(error)

      throw new InternalServerError("Failure On 'findUserById'")
    }
  }

  @Put('/pswd')
  async pswdUser(@Req() req: ServerRequest, @Body() body: { oldPswd: string; newPswd: string }) {
    console.log(body)
    if ((await getUserFromToken(req.headers, false)) == false) {
      return Content(new ForbiddenError('Not Authorized'), 403)
    }
    try {
      const iss = await this.verifyAuth(req.headers)

      if (!iss) {
        return new ForbiddenError('Nope...')
      }

      if (isEmpty(body)) {
        return new BadRequestError('Body Is Empty...')
      }
      console.log(body)
      const { oldPswd, newPswd } = body

      console.log(oldPswd, newPswd)

      const document = await this.userService.findUserById(iss)

      if (document && document.password) {
        const comparedPswd = await compare(oldPswd, document.password)

        if (comparedPswd) {
          const newSalt = await genSalt(10)
          const hashedPswd = await hash(newPswd, newSalt)

          const count = await this.userService.updateUserById(iss, {
            password: hashedPswd
          })

          if (count) {
            return Content({ message: 'Okay Password Changed' }, 200)
          }

          return Content({ message: 'Nothing Happened' }, 204)
        }

        return new UnauthorizedError('Nope...')
      }

      return new NotFoundError('User Not Found...')
    } catch (error) {
      console.log(error)

      throw new InternalServerError("Failure On 'updateUserById'")
    }
  }

  @Put('/:userid')
  async setUser(
    @Req() req: ServerRequest,
    @Body() body: Partial<User>,
    @Param('userid') userid: string
  ) {
    if ((await getUserFromToken(req.headers, true)) == false) {
      return Content(new ForbiddenError('Not Authorized'), 403)
    }
    try {
      const iss = await this.verifyAuth(req.headers)

      if (!iss) {
        return new ForbiddenError('Nope...')
      }
      console.log({ body })
      if (isEmpty(body)) {
        return new BadRequestError('Body Is Empty...')
      }

      const { password, ...user } = body

      const document: UserDocument = await this.userService.findUserById(userid)

      if (document) {
        const count = await this.userService.updateUserById(iss, user)

        if (count) {
          return Content(await this.userService.findUserById(userid), 200)
        }

        return Content({ message: 'Nothing Happened' }, 204)
      }

      return new NotFoundError('User Not Found...')
    } catch (error) {
      console.log(error)

      throw new InternalServerError("Failure On 'updateUserById'")
    }
  }

  @Delete('/')
  async clearUser(@Req() req: ServerRequest) {
    if ((await getUserFromToken(req.headers, true)) == false) {
      return Content(new ForbiddenError('Not Authorized'), 403)
    }
    try {
      const iss = await this.verifyAuth(req.headers)

      if (!iss) {
        return new ForbiddenError('Nope...')
      }

      const document: UserDocument = await this.userService.findUserById(iss)

      if (document) {
        const count = await this.userService.deleteUserById(iss)

        if (count) {
          return Content({ message: 'Okay' }, 204)
        }

        return Content({ message: 'Nothing Happened' }, 204)
      }

      return new NotFoundError('User Not Found...')
    } catch (error) {
      console.log(error)

      throw new InternalServerError("Failure On 'deleteUserById'")
    }
  }

  @Get('/thisisadmin')
  async thisIsAdmin(@Req() req: ServerRequest) {
    if ((await getUserFromToken(req.headers, true)) == false) {
      return Content(false, 403)
    }
    return Content(true, 200)
  }

  @Get('/thisislogged')
  async thisIsLogged(@Req() req: ServerRequest) {
    if ((await getUserFromToken(req.headers, false)) == false) {
      return Content(false, 403)
    }
    return Content(true, 200)
  }
}
