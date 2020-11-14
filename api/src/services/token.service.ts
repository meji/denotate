import { Injectable } from '../../deps.ts'
import { Token, TokenDocument } from '../models/token.ts'
import db from '../config/db.ts'

interface ObjectID {
  $oid: string
}

@Injectable()
export class TokenService {
  private collection: any

  constructor() {
    const database = db.getDatabase
    this.collection = database.collection('tokens')
  }

  async findAllTokens(): Promise<TokenDocument[]> {
    return await this.collection.find()
  }

  async findTokenById(id: string): Promise<TokenDocument> {
    return await this.collection.findOne({ _id: { $oid: id } })
  }

  async insertToken(account: Token): Promise<ObjectID> {
    return await this.collection.insertOne(account)
  }

  async updateTokenById(id: string, account: Partial<Token>): Promise<number> {
    const { modifiedCount } = await this.collection.updateOne(
      { _id: { $oid: id } },
      { $set: account }
    )

    return modifiedCount
  }

  async deleteTokenById(id: string): Promise<number> {
    return await this.collection.deleteOne({ _id: { $oid: id } })
  }
}
