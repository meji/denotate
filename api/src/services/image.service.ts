import { Injectable } from '../../deps.ts'
import db from '../config/db.ts'
import { Image, ImageDoc } from '../models/image.ts'

@Injectable()
export class ImageService {
  private collection: any

  constructor() {
    const database = db.getDatabase
    this.collection = database.collection('images')
  }
  async findImageById(id: string): Promise<ImageDoc> {
    return await this.collection.findOne({ _id: { $oid: id } })
  }
  async findImageByTitle(title: string): Promise<ImageDoc> {
    return await this.collection.findOne({ title })
  }
  async insertImage(image: Image): Promise<any> {
    return await this.collection.insertOne(image)
  }
  async uploadImage(image: any): Promise<any> {
    console.log(image)
    if (image) {
      const path = Deno.cwd() + '/public/uploads/' + image.name
      await Deno.writeFileSync(path, image, {
        create: true
      })
      return path
    }
  }
}
