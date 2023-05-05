const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')

let headers

beforeEach(async () => {
  //clear out database at beginning
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))

  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)

  const newUser =
  {
    'username': 'king',
    'name': 'Lebron',
    'password': 'lebronisking'
  }

  await api
    .post('/api/users')
    .send(newUser)

  const result = await api
    .post('/api/login')
    .send(newUser)

  headers = {
    'Authorization': `bearer ${result.body.token}`
  }

})

describe('when there is initially some notes saved', () => {
  //test all blogs are returned as JSON
  test('blogs are returned as JSON', async () => {

    await api
      .get('/api/blogs')
      .set(headers)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  //amount of blog posts are correct
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs').set(headers)
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  //verify unique identifier property of blog is "id"
  test('verify unique identifier property = id', async () => {
    const response = await api.get('/api/blogs').set(headers)

    response.body.forEach(blog => {
      expect(blog.id).toBeDefined()
    })
  })
})

describe('addition of new blog', () => {
  //verify HTTP post request
  test('verify a valid blog post request', async () => {
    const newBlog = {
      title: 'The kid from Akron',
      author: 'Lebron James',
      url: 'https://www.beaconjournal.com/story/sports/pro/cavs/2022/02/21/just-a-kid-from-akron-lebron-james-2022-nba-all-star-game-cleveland-st-vincent-st-mary-stephen-curry/6876967001/',
      likes: 100,
    }

    await api
      .post('/api/blogs')
      .set(headers)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(n => n.title)
    expect(titles).toContain(
      'The kid from Akron'
    )
  })

  //verify if likes property is missing, default like to 0
  test('verify a blog post request with no likes property', async () => {
    const newBlog = {
      title: 'The kid from Akron',
      author: 'Lebron James',
      url: 'https://www.beaconjournal.com/story/sports/pro/cavs/2022/02/21/just-a-kid-from-akron-lebron-james-2022-nba-all-star-game-cleveland-st-vincent-st-mary-stephen-curry/6876967001/',
    }

    await api
      .post('/api/blogs')
      .set(headers)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const addedBlog = blogsAtEnd.find(title => title.title === 'The kid from Akron')
    expect(addedBlog.likes).toBe(0)
  })

  //verify invalid blogs will not be added
  test('verify an invalid blog post request, such as no title & url', async () => {
    const newBlog = {
      author: 'Lebron James',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .set(headers)
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('deletion of blog', () => {
  test('verify deletion of a valid blog', async () => {
    const newBlog = {
      title: 'The kid from Akron',
      author: 'Lebron James',
      url: 'https://www.beaconjournal.com/story/sports/pro/cavs/2022/02/21/just-a-kid-from-akron-lebron-james-2022-nba-all-star-game-cleveland-st-vincent-st-mary-stephen-curry/6876967001/',
      likes: 100,
    }

    await api
      .post('/api/blogs')
      .set(headers)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterPost = await helper.blogsInDb()
    expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length + 1)

    const blogToDelete = blogsAfterPost.find(blog => blog.title === newBlog.title)

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set(headers)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

    const blogTitle = blogsAtEnd.map(r => r.title)
    expect(blogTitle).not.toContain(blogToDelete.title)
  })
})

describe('update information of blog', () => {
  test('verify updating the likes of a blog', async () => {
    const newBlog = {
      title: 'The kid from Akron',
      author: 'Lebron James',
      url: 'https://www.beaconjournal.com/story/sports/pro/cavs/2022/02/21/just-a-kid-from-akron-lebron-james-2022-nba-all-star-game-cleveland-st-vincent-st-mary-stephen-curry/6876967001/',
      likes: 100,
    }

    await api
      .post('/api/blogs')
      .set(headers)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterPost = await helper.blogsInDb()
    expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length + 1)

    const blogForUpdate = blogsAfterPost.find(blog => blog.title === newBlog.title)

    const newBlogForUpdate = {
      ...blogForUpdate,
      likes: 25,
    }

    await api
      .put(`/api/blogs/${blogForUpdate.id}`)
      .set(headers)
      .send(newBlogForUpdate)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(blog => blog.title === newBlog.title)
    expect(updatedBlog.likes).toBe(25)
  })
})


describe('verify token', () => {
  test('401 status code is token not provided', async () => {
    const newBlog = {
      title: 'The kid from Akron',
      author: 'Lebron James',
      url: 'https://www.beaconjournal.com/story/sports/pro/cavs/2022/02/21/just-a-kid-from-akron-lebron-james-2022-nba-all-star-game-cleveland-st-vincent-st-mary-stephen-curry/6876967001/',
      likes: 100,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      //could only get 400
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

  })
})

afterAll(async () => {
  await mongoose.connection.close()
})