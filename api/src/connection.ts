import { Database } from "../deps.ts";

//Mongo Connection
const db = new Database("mongo", {
  uri: Deno.env.get("DATABASE"),
  database: "site"
});

export default db;
