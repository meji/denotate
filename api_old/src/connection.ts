import { MongoClient } from '../deps.ts'

const client = new MongoClient()
client.connectWithUri(Deno.env.get('DATABASE') as string)
export const db = client.database('site')
