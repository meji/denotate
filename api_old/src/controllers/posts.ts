import { Context } from '../../deps.ts'
import { Posts } from '../models/posts.ts'

export const getPostById = async ({ response, params }: Context | any) => {
  try {
    const { id } = params
    response.body = await Posts.findOne({ _id: { $oid: id } })
    response.status = 200
  } catch (e) {
    response.body = null
    response.status = 500
    console.log(e)
  }
}
export const getPost = async ({ response }: Context) => {
  try {
    response.body = await Posts.find({ title: { $ne: null } })
  } catch (e) {
    response.body = null
    response.status = 500
    console.log(e)
  }
}
export const addPost = async ({ request, response }: Context) => {
  try {
    let { title, brief, description } = await request.body().value
    if (!title) {
      title = 'Default title'
    }
    if (!brief) {
      title = 'Default brief'
    }
    if (!description) {
      description = 'Default description'
    }
    // inserting into the db
    const post = await Posts.insertOne({
      title: title,
      brief: brief,
      description: description
    })

    //sending the response
    response.body = await Posts.findOne({ _id: { $oid: post.$oid } })
    response.status = 201
  } catch (e) {
    // when the insertion fails
    response.body = null
    response.status = 500
    console.log(e)
  }
}
