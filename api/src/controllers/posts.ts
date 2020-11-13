import { Context } from '../../deps.ts'
export const getPost = async ({ request, response }: Context) => {
  response.status = 201
  response.body = 'Hola post'
}
