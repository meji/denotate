import { Context } from '../../deps.ts'
import { Categories } from '../models/categories.ts'
import { Posts } from '../models/posts.ts'

export const getCategoryById = async ({ response, params }: Context | any) => {
  try {
    const { id } = params
    response.body = await Categories.findOne({ _id: { $oid: id } })
    response.status = 200
  } catch (e) {
    response.body = null
    response.status = 500
    console.log(e)
  }
}
export const getCategory = async ({ response }: Context) => {
  try {
    response.body = await Categories.find({ title: { $ne: null } })
  } catch (e) {
    response.body = null
    response.status = 500
    console.log(e)
  }
}
export const addCategory = async ({ request, response }: Context) => {
  try {
    let { title, brief, description, posts } = await request.body().value
    console.log(posts)
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
    const category = await Categories.insertOne({
      title: title,
      brief: brief,
      description: description,
      posts: posts
    })

    //sending the response
    response.body = await Categories.findOne({ _id: { $oid: category.$oid } })
    response.status = 201
  } catch (e) {
    // when the insertion fails
    response.body = null
    response.status = 500
    console.log(e)
  }
}

export const getAllPosts = async ({ response, params }: Context | any) => {
  try {
    const { id } = params
    const category = await Categories.findOne({ _id: { $oid: id } })
    if (category) {
      response.body = await Promise.all(
        category.posts.map(async post => {
          return await Posts.findOne({ _id: { $oid: post.$oid } })
        })
      )
      response.status = 200
    } else {
      console.log('No existe')
      response.body = 'That category does not exists'
      response.status = 404
    }
  } catch (e) {
    response.body = null
    response.status = 500
    console.log(e)
  }
}
