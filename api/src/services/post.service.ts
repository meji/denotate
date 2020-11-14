import { Injectable } from '../../deps.ts'
import { Post, PostDoc } from '../models/post.ts'
import db from '../config/db.ts'

@Injectable()
export class PostService {
  private collection: any

  constructor() {
    const database = db.getDatabase
    this.collection = database.collection('posts')
  }

  async findAllPostsByUser(user: string): Promise<PostDoc[]> {
    return await this.collection.find({ user: user })
  }

  async findPostById(id: string): Promise<PostDoc> {
    return await this.collection.findOne({ _id: { $oid: id } })
  }

  async findPostByTitle(query: string): Promise<PostDoc> {
    return await this.collection.findOne({ query })
  }

  async insertPost(post: Post): Promise<any> {
    return await this.collection.insertOne(post)
  }

  async updatePostById(id: string, post: Partial<Post>): Promise<number> {
    const { modifiedCount } = await this.collection.updateOne({ _id: { $oid: id } }, { $set: post })
    return modifiedCount
  }

  // async updatePostByTitle(title: string, post: Partial<Post>): Promise<number> {
  //   const { modifiedCount } = await this.collection.updateOne({ title }, { $set: post })
  //
  //   return modifiedCount
  // }

  async deletePostById(id: string): Promise<number> {
    return await this.collection.deleteOne({ _id: { $oid: id } })
  }

  async findAllPostsByQuery(user?: string, cat?: string, tag?: string): Promise<PostDoc[]> {
    const posts = await this.collection.find({
      $or: [{ cat: { $oid: cat } }, { user: { $oid: user } }, { tags: { $all: [{ $oid: tag }] } }]
    })
    return posts
  }
}
