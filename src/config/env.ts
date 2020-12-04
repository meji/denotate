import 'https://deno.land/x/dotenv/load.ts'
import { Env, StringOrNumber } from '../models/env.ts'

class EnvBuilder {
  private env: Env

  constructor() {
    this.env = {} as Env
  }

  withCurrentWorkingDir(defaultDir: string) {
    this.env.currentWorkingDir = Deno.cwd() || defaultDir
    return this
  }

  withDenoEnv(defaultEnv: string) {
    this.env.denoEnv = Deno.env.get('DENO_ENV') || defaultEnv
    return this
  }

  withDenoHost(defaultHost: string) {
    this.env.denoHost = Deno.env.get('DENO_HOST') || defaultHost
    return this
  }

  withDenoPort(defaultPort: StringOrNumber) {
    this.env.denoPort = Deno.env.get('DENO_PORT') || defaultPort
    return this
  }

  withDbName(defaultName: string) {
    this.env.dbName = Deno.env.get('DB_NAME') || defaultName
    return this
  }

  withDbUri(defaultUri: string) {
    this.env.dbUri = Deno.env.get('DB_URI') || defaultUri
    return this
  }

  withDbPort(defaultPort: StringOrNumber) {
    this.env.dbPort = Deno.env.get('DB_PORT') || defaultPort
    return this
  }

  withSecret(defaultSecret: string) {
    this.env.secret = Deno.env.get('SECRET') || defaultSecret
    return this
  }

  builder(): Env {
    return this.env
  }
}

const env = new EnvBuilder()
  .withCurrentWorkingDir('./')
  .withDenoEnv('dev')
  .withDenoHost('localhost')
  .withDenoPort(8080)
  .withDbName('deno_land')
  .withDbUri('localhost')
  .withDbPort(27017)
  .withSecret('HelloWorld')
  .builder()

export default env
