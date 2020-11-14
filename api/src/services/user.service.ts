import { Injectable } from '../../deps.ts'
import { User, UserDocument } from '../models/user.ts'
import db from '../config/db.ts'

interface ObjectID {
  $oid: string
}

@Injectable()
export class UserService {
  private collection: any

  constructor() {
    const database = db.getDatabase
    this.collection = database.collection('users')
  }

  async findAllUsers(): Promise<UserDocument[]> {
    return await this.collection.find()
  }

  async findUserById(id: string): Promise<UserDocument> {
    return await this.collection.findOne({ _id: { $oid: id } })
  }

  async findUserByLogin(login: string): Promise<UserDocument> {
    return await this.collection.findOne({ login })
  }

  async insertUser(user: User): Promise<ObjectID> {
    return await this.collection.insertOne(user)
  }

  async updateUserById(id: string, user: Partial<User>): Promise<number> {
    const { modifiedCount } = await this.collection.updateOne({ _id: { $oid: id } }, { $set: user })

    return modifiedCount
  }

  async updateUserByLogin(login: string, user: Partial<User>): Promise<number> {
    const { modifiedCount } = await this.collection.updateOne({ login }, { $set: user })

    return modifiedCount
  }

  async deleteUserById(id: string): Promise<number> {
    return await this.collection.deleteOne({ _id: { $oid: id } })
  }
}
