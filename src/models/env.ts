export type StringOrNumber = string | number

export interface Env {
  currentWorkingDir: string
  denoEnv: string
  denoHost: string
  denoPort: StringOrNumber
  dbName: string
  dbUri: string
  dbPort: StringOrNumber
  secret: string
}
