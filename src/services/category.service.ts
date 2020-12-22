import { Injectable } from "../../deps.ts";
import { Category, CategoryDoc } from "../models/category.ts";
import db from "../config/db.ts";
import { ObjectID } from "../models/id.ts";
import { PostDoc } from "../models/post.ts";

@Injectable()
export class CategoryService {
  private collection: any;

  constructor() {
    const database = db.getDatabase;
    this.collection = database.collection("category");
  }

  async findAllCategories(): Promise<CategoryDoc[]> {
    return await this.collection.find({});
  }

  async findCategoryById(id: string): Promise<CategoryDoc> {
    return await this.collection.findOne({ _id: { $oid: id } });
  }

  async findAllCategoriesByQuery(
    user?: string,
    cat?: string,
    post?: string,
    title?: string
  ): Promise<PostDoc[]> {
    const categories = await this.collection.find({
      $or: [
        { cats: { $all: [{ $oid: cat }] } },
        { user: { $oid: user } },
        { posts: { $all: [{ $oid: post }] } },
        { title: title }
      ]
    });
    return categories;
  }

  async insertCategory(category: Category): Promise<any> {
    return await this.collection.insertOne(category);
  }

  async updateCategoryById(
    id: string,
    post: Partial<Category>
  ): Promise<number> {
    const { modifiedCount } = await this.collection.updateOne(
      { _id: { $oid: id } },
      { $set: post }
    );
    return modifiedCount;
  }

  async updatePostInCategory(
    id: string,
    post: { $oid: string }
  ): Promise<number> {
    const { modifiedCount } = await this.collection.updateOne(
      { _id: { $oid: id } },
      { $addToSet: { posts: post } }
    );
    console.log("actualizando cateogoría " + id + "con posts" + post);
    return modifiedCount;
  }

  async deletePostInCategory(
    id: string,
    post: { $oid: string }
  ): Promise<number> {
    const { modifiedCount } = await this.collection.updateOne(
      { _id: { $oid: id } },
      { $pull: { posts: post } }
    );
    return modifiedCount;
  }

  async deleteCategoryById(id: string): Promise<number> {
    return await this.collection.deleteOne({ _id: { $oid: id } });
  }

  async getPostsFromCategory(id: string): Promise<any> {
    const category = await this.collection.findOne({ _id: { $oid: id } });
    return category.posts;
  }
}
