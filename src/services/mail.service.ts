import { Injectable, SmtpClient } from '../../deps.ts'
import env from '../config/env.ts'
export const client = new SmtpClient()

@Injectable()
export class MailService {
  private user: string
  private pass: string

  constructor() {
    this.user = env.user
    this.pass = env.password
  }

  async connect() {
    await client.connectTLS({
      hostname: 'smtp.gmail.com',
      port: 465,
      username: this.user,
      password: this.pass
    })
  }
  async send(content: string, receiver: string) {
    await client.send({
      from: this.user,
      to: receiver,
      subject: 'Bienvenido a Denotate',
      content: content
    })
  }

  async close() {
    await client.close()
  }
}
