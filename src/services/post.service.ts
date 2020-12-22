import { Injectable } from "../../deps.ts";
import { Post, PostDoc } from "../models/post.ts";
import db from "../config/db.ts";

@Injectable()
export class PostService {
  private collection: any;

  constructor() {
    const database = db.getDatabase;
    this.collection = database.collection("posts");
  }

  async findAllPosts(): Promise<PostDoc[]> {
    return await this.collection.find({});
  }

  async findPostById(id: string): Promise<PostDoc> {
    return await this.collection.findOne({ _id: { $oid: id } });
  }

  async findPostByTitle(query: string): Promise<PostDoc> {
    return await this.collection.findOne({ title: query });
  }

  async insertPost(post: Post): Promise<any> {
    return await this.collection.insertOne(post);
  }

  async updatePostById(id: string, post: Partial<Post>): Promise<number> {
    const { modifiedCount } = await this.collection.updateOne(
      { _id: { $oid: id } },
      { $set: post }
    );
    return modifiedCount;
  }

  async deletePostById(id: string): Promise<number> {
    return await this.collection.deleteOne({ _id: { $oid: id } });
  }

  async deleteCategoryFromPost(
    id: string,
    idCategory: string
  ): Promise<number> {
    return await this.collection.updateOne(
      { _id: { $oid: id } },
      { $pull: { cats: { $oid: idCategory } } }
    );
  }

  async deleteTagFromPost(id: string, idTag: string): Promise<number> {
    return await this.collection.updateOne(
      { _id: { $oid: id } },
      { $pull: { tags: { $oid: idTag } } }
    );
  }

  async findAllPostsByQuery(
    user?: string,
    cat?: string,
    tag?: string,
    title?: string
  ): Promise<PostDoc[]> {
    const posts = await this.collection.find({
      $or: [
        { cats: { $all: [{ $oid: cat }] } },
        { user: { $oid: user } },
        { tags: { $all: [{ $oid: tag }] } },
        { title: title }
      ]
    });
    return posts;
  }
}
