import { Context } from '../../deps.ts'
export const indexController = async ({ request, response }: Context) => {
  response.status = 201
  response.body = 'Hola Index'
}
