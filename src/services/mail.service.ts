import { Injectable, SmtpClient } from '../../deps.ts'
export const client = new SmtpClient()

@Injectable()
export class MailService {
  private user: string
  private pass: string

  constructor(user: string, pass: string) {
    this.user = user
    this.pass = pass
  }

  async connect() {
    await client.connectTLS({
      hostname: 'smtp.gmail.com',
      port: 465,
      username: this.user,
      password: this.pass
    })
  }
  async send(content: string) {
    await client.send({
      from: this.user,
      to: this.pass,
      subject: 'Bienvenido a Denotate',
      content: content
    })
  }

  async close() {
    await client.close()
  }
}
