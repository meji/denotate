import { Injectable } from "../../deps.ts";
import db from "../config/db.ts";
import { Image, ImageDoc } from "../models/image.ts";

@Injectable()
export class ImageService {
  private collection: any;

  constructor() {
    const database = db.getDatabase;
    this.collection = database.collection("images");
  }
  async findImageById(id: string): Promise<ImageDoc> {
    return await this.collection.findOne({ _id: { $oid: id } });
  }
  async findImageByTitle(title: string): Promise<ImageDoc> {
    return await this.collection.findOne({ title });
  }
  async insertImage(image: Image): Promise<any> {
    return await this.collection.insertOne(image);
  }
  async uploadImage(image: any, name: string): Promise<any> {
    if (image) {
      console.log(name);
      console.log(image);
      const imgConverted = new Uint8Array(image);
      const path = Deno.cwd() + "/public/uploads/" + name;
      await Deno.writeFile(path, imgConverted, {
        create: true
      });
      return path;
    }
  }
}
