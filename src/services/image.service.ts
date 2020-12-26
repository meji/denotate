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
  async uploadImage(image: any, name: string): Promise<any> {
    if (image) {
      const imgConverted = new Uint8Array(image);
      const path = Deno.cwd() + "/public/uploads/" + name;
      await Deno.writeFile(path, imgConverted, {
        create: true
      });
      return path;
    }
  }

  // async getImage(name: string): Promise<any> {
  //   return Deno.readFileSync("./public/uploads/" + name);
  // }
}
