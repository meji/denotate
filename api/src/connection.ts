import { MongoClient } from "../deps.ts";

const client = new MongoClient();
client.connectWithUri(Deno.env.get("DATABASE"));
export const db = client.database("site");
