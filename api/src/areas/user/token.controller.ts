import { Controller } from '../../../deps.ts'
import { TokenService } from '../../services/token.service.ts'

@Controller()
export class TokenController {
  constructor(private service: TokenService) {
    this.resetTokens()
  }

  /**
   * Reset Tokens (If Expired)
   */
  private async resetTokens() {
    const allTokens = await this.service.findAllTokens()
    for (const {
      _id: { $oid: id },
      exp
    } of allTokens) {
      const now = new Date()
      if (exp < now.getTime()) {
        await this.service.deleteTokenById(id)
      }
    }
  }
}
