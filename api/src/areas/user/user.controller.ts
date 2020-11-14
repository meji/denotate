import {
  readJsonSync,
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
  makeJwt,
  setExpiration,
  validateJwt
} from '../../../deps.ts'
import { User, UserDocument } from '../../models/user.ts'
import { UserService } from '../../services/user.service.ts'
import { TokenService } from '../../services/token.service.ts'
import env from '../../config/env.ts'
import { isEmpty, convertBearerToToken } from '../../utils'

type StringOrNull = string | null

@Controller()
export class UserController {
  constructor(private userService: UserService, private tokenService: TokenService) {
    this.initUser('users.json')
  }

  /**
   * Initialize Users DataSet
   *
   * @param {String} fileName JSON FileName
   */
  private async initUser(fileName: string) {
    const users = await readJsonSync(`${env.currentWorkingDir}/datasets/${fileName}`)
    ;(users as User[]).forEach(async ({ login, password, ...user }) => {
      const document: UserDocument = await this.userService.findUserByLogin(login)

      if (document) {
        return await this.userService.updateUserByLogin(login, user)
      }

      const newSalt = await genSalt(10)
      const hashedPswd = await hash(password, newSalt)

      return await this.userService.insertUser({
        login,
        password: hashedPswd,
        ...user
      })
    })
  }

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

    const jwt = await validateJwt(token, env.secret, { isThrowing: false })

    if (!jwt || !jwt.payload || !jwt.payload.iss || !jwt.payload.exp) {
      return null
    }

    if (isLogout) {
      await this.tokenService.insertToken({
        header,
        payload,
        signature,
        exp: jwt.payload.exp
      })
    }

    return jwt.payload.iss
  }

  @Post('/user/register')
  async registerUser(@Body() body: User) {
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

      const token = makeJwt({
        header: {
          alg: 'HS256',
          typ: 'JWT'
        },
        payload: {
          iss: id,
          exp: setExpiration(new Date().getTime() + 60 * 60 * 6 * 1000) // NOTE: 6h
        },
        key: env.secret
      })

      return Content({ token }, 201)
    } catch (error) {
      console.log(error)

      throw new InternalServerError("Failure On 'insertUser'")
    }
  }

  @Post('/user/login')
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
          const token = makeJwt({
            header: {
              alg: 'HS256',
              typ: 'JWT'
            },
            payload: {
              iss: id,
              exp: setExpiration(new Date().getTime() + 60 * 60 * 6 * 1000) // NOTE: 6h
            },
            key: env.secret
          })

          return { token }
        }

        return new UnauthorizedError('Nope...')
      }

      return new NotFoundError('User Not Found...')
    } catch (error) {
      console.log(error)

      throw new InternalServerError("Failure On 'findUserByLogin'")
    }
  }

  @Get('/user/logout')
  async logoutUser(@Req() req: ServerRequest) {
    try {
      const iss = await this.verifyAuth(req.headers, true)

      if (!iss) {
        return new ForbiddenError('Nope...')
      }

      const document = await this.userService.findUserById(iss)

      if (document) {
        return { token: null }
      }

      return new NotFoundError('User Not Found...')
    } catch (error) {
      console.log(error)

      throw new InternalServerError("Failure On 'findUserById'")
    }
  }

  @Get('/users')
  async getAllUsers() {
    try {
      const documents: UserDocument[] = await this.userService.findAllUsers()

      return documents.map(({ login, password }) => ({ login, password }))
    } catch (error) {
      console.log(error)

      throw new InternalServerError("Failure On 'findAllUsers'")
    }
  }

  @Get('/user')
  async getUser(@Req() req: ServerRequest) {
    try {
      const iss = await this.verifyAuth(req.headers)

      if (!iss) {
        return new ForbiddenError('Nope...')
      }

      // CLEARFIX: Extract Pswd !
      const {
        password,
        _id: { $oid: id },
        ...document
      } = await this.userService.findUserById(iss)

      if (document) {
        return { id, ...document }
      }

      return new NotFoundError('User Not Found...')
    } catch (error) {
      console.log(error)

      throw new InternalServerError("Failure On 'findUserById'")
    }
  }

  @Put('/user/pswd')
  async pswdUser(@Req() req: ServerRequest, @Body() body: { oldPswd: string; newPswd: string }) {
    try {
      const iss = await this.verifyAuth(req.headers)

      if (!iss) {
        return new ForbiddenError('Nope...')
      }

      if (isEmpty(body)) {
        return new BadRequestError('Body Is Empty...')
      }

      const { oldPswd, newPswd } = body

      const document = await this.userService.findUserById(iss)

      if (document && document.password) {
        const comparedPswd = await compare(oldPswd, document.password)

        if (comparedPswd) {
          const newSalt = await genSalt(10)
          const hashedPswd = await hash(newPswd, newSalt)

          const count = await this.userService.updateUserById(iss, { password: hashedPswd })

          if (count) {
            return Content({ message: 'Okay ' }, 204)
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

  @Put('/user')
  async setUser(@Req() req: ServerRequest, @Body() body: Partial<User>) {
    try {
      const iss = await this.verifyAuth(req.headers)

      if (!iss) {
        return new ForbiddenError('Nope...')
      }

      if (isEmpty(body)) {
        return new BadRequestError('Body Is Empty...')
      }

      // CLEARFIX: Extract / Don't Save Pswd !
      const { password, ...user } = body

      const document: UserDocument = await this.userService.findUserById(iss)

      if (document) {
        const count = await this.userService.updateUserById(iss, user)

        if (count) {
          return Content({ message: 'Okay' }, 204)
        }

        return Content({ message: 'Nothing Happened' }, 204)
      }

      return new NotFoundError('User Not Found...')
    } catch (error) {
      console.log(error)

      throw new InternalServerError("Failure On 'updateUserById'")
    }
  }

  @Delete('/user')
  async clearUser(@Req() req: ServerRequest) {
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
}
