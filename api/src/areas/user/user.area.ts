import { Area } from '../../../deps.ts'
import { UserController } from './user.controller.ts'
import { TokenController } from './token.controller.ts'

@Area({
  baseRoute: '/api',
  controllers: [UserController, TokenController]
})
export class UserArea {}
