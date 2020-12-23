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
    const siteData = await this.collection.findOne({});
    if (siteData && siteData.database) {
      delete siteData.database;
    }
    return siteData;
  }
  async updateSiteData(data: Partial<Site>): Promise<SiteDoc> {
    const { modifiedCount } = await this.collection.updateOne(
      {},
      { $set: data }
    );
    return modifiedCount;
  }
  async createSiteData(site: Partial<Site>): Promise<any> {
    const path = "./siteData.json";
    await writeJson(path, site);
    return await this.collection.insertOne(site);
  }
}
