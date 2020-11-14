import { MongoClient, Database } from '../../deps.ts'
import env from './env.ts'

// await init();

class DB {
  private client: MongoClient
  constructor(private dbName: string, private dbUri: string) {
    this.dbName = dbName
    this.dbUri = dbUri
    this.client = {} as MongoClient
  }

  connect() {
    const client = new MongoClient()
    console.log(this.dbUri)
    client.connectWithUri(this.dbUri)
    this.client = client
  }

  get getDatabase(): Database {
    return this.client.database(this.dbName)
  }
}

const db = new DB(env.dbName, env.dbUri)

db.connect()

export default db
