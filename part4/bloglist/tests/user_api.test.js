const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')


describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('lakers', 10)
    const user = new User({ username: 'lakerschampion', passwordHash })

    await user.save()
  })


  test('verify creating user with valid username and name', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser =
      {
        'username': 'king',
        'name': 'Lebron',
        'password': 'lebronisking'
      }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)

  })

  test('verify creating user with invalid username and name', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser =
      {
        'username': 'lakerschampion',
        'name': 'Lebron',
        'password': 'lakers'
      }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    expect(result.body.error).toContain('`username` to be unique')

  })

  test('verify if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser =
      {
        'username': 'king',
        'name': 'Lebron',
        'password': 'h'
      }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
    expect(result.body.error).toContain('is shorter than the minimum allowed length (3)')

  })


})


afterAll(async () => {
  await mongoose.connection.close()
})