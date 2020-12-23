import { Injectable } from "../../deps.ts";
import { Site, SiteDoc } from "../models/site.ts";
import db from "../config/db.ts";
import { writeJson } from "../utils/index.ts";

@Injectable()
export class SiteService {
  private collection: any;
  constructor() {
    const database = db.getDatabase;
    this.collection = database.collection("site");
  }
  async getSiteData(): Promise<Partial<SiteDoc>> {
    return await this.collection.findOne({});
  }
  async updateSiteData(data: Partial<Site>): Promise<number> {
    const { modifiedCount } = await this.collection.updateOne(
      {},
      { $set: data }
    );
    return modifiedCount;
  }
  async createSiteData(site: Partial<Site>): Promise<any> {
    return await this.collection.insertOne(site);
  }
}
