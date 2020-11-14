import { Injectable } from '../../deps.ts'
import { Category, CategoryDoc } from '../models/category.ts'
import db from '../config/db.ts'

@Injectable()
export class CategoryService {
  private collection: any

  constructor() {
    const database = db.getDatabase
    this.collection = database.collection('category')
  }

  async findAllCategoriesByUser(user: string): Promise<CategoryDoc[]> {
    return await this.collection.find({ user: user })
  }

  async findCategoryById(id: string): Promise<CategoryDoc> {
    return await this.collection.findOne({ _id: { $oid: id } })
  }

  async findCategoryByQuery(query: string): Promise<CategoryDoc> {
    return await this.collection.findOne({ query })
  }

  async insertCategory(post: Category): Promise<any> {
    return await this.collection.insertOne(post)
  }

  async updateCategoryById(id: string, post: Partial<Category>): Promise<number> {
    const { modifiedCount } = await this.collection.updateOne({ _id: { $oid: id } }, { $set: post })
    return modifiedCount
  }

  async deleteCategoryById(id: string): Promise<number> {
    return await this.collection.deleteOne({ _id: { $oid: id } })
  }

  async getPostsFromCategory(id: string): Promise<any> {
    const category = await this.collection.findOne({ _id: { $oid: id } })
    console.log(category)
    return category.posts
  }
}
