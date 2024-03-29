const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')
// const middleware = require('../utils/middleware')


blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})


blogRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user.id
  })


  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)

})

blogRouter.delete('/:id', userExtractor, async (request, response) => {

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  // const user = await User.findById(decodedToken.id)
  const user = request.user

  const blog = await Blog.findById(request.params.id)

  if ( blog.user._id.toString() === user._id.toString() ) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
    console.log('content removed')
  }

})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)

})

module.exports = blogRouter