import { Injectable } from "../../deps.ts";
import { Tag, TagDoc } from "../models/tag.ts";
import db from "../config/db.ts";
import { PostDoc } from "../models/post.ts";
import { CategoryDoc } from "../models/category.ts";

@Injectable()
export class TagService {
  private collection: any;

  constructor() {
    const database = db.getDatabase;
    this.collection = database.collection("tag");
  }

  async findAllTags(): Promise<CategoryDoc[]> {
    return await this.collection.find({});
  }
  async findAllTagsByQuery(
    user?: string,
    post?: string,
    title?: string
  ): Promise<PostDoc[]> {
    const tags = await this.collection.find({
      $or: [
        { user: { $oid: user } },
        { posts: { $all: [{ $oid: post }] } },
        { title: title }
      ]
    });
    return tags;
  }

  async findTagById(id: string): Promise<TagDoc> {
    return await this.collection.findOne({ _id: { $oid: id } });
  }

  async findTagByQuery(query: string): Promise<TagDoc> {
    return await this.collection.findOne({ query });
  }

  async insertTag(post: Tag): Promise<any> {
    return await this.collection.insertOne(post);
  }

  async updateTagById(id: string, post: Partial<Tag>): Promise<number> {
    const { modifiedCount } = await this.collection.updateOne(
      { _id: { $oid: id } },
      { $set: post }
    );
    return modifiedCount;
  }

  async deleteTagById(id: string): Promise<number> {
    return await this.collection.deleteOne({ _id: { $oid: id } });
  }

  async getPostsFromTag(id: string): Promise<any> {
    const tag = await this.collection.findOne({ _id: { $oid: id } });
    console.log(tag);
    return tag.posts;
  }
  async updatePostInTag(id: string, post: { $oid: string }): Promise<number> {
    const { modifiedCount } = await this.collection.updateOne(
      { _id: { $oid: id } },
      { $addToSet: { posts: post } }
    );
    return modifiedCount;
  }
  async deletePostInTag(id: string, post: { $oid: string }): Promise<number> {
    const { modifiedCount } = await this.collection.updateOne(
      { _id: { $oid: id } },
      { $pull: { posts: post } }
    );
    return modifiedCount;
  }
}
