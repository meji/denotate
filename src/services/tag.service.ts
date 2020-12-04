import { Injectable } from '../../deps.ts'
import { Tag, TagDoc } from '../models/tag.ts'
import db from '../config/db.ts'

@Injectable()
export class TagService {
  private collection: any

  constructor() {
    const database = db.getDatabase
    this.collection = database.collection('tag')
  }

  async findAllCategoriesByUser(user: string): Promise<TagDoc[]> {
    return await this.collection.find({ user: user })
  }

  async findTagById(id: string): Promise<TagDoc> {
    return await this.collection.findOne({ _id: { $oid: id } })
  }

  async findTagByQuery(query: string): Promise<TagDoc> {
    return await this.collection.findOne({ query })
  }

  async insertTag(post: Tag): Promise<any> {
    return await this.collection.insertOne(post)
  }

  async updateTagById(id: string, post: Partial<Tag>): Promise<number> {
    const { modifiedCount } = await this.collection.updateOne({ _id: { $oid: id } }, { $set: post })
    return modifiedCount
  }

  async deleteTagById(id: string): Promise<number> {
    return await this.collection.deleteOne({ _id: { $oid: id } })
  }

  async getPostsFromTag(id: string): Promise<any> {
    const tag = await this.collection.findOne({ _id: { $oid: id } })
    console.log(tag)
    return tag.posts
  }
}
