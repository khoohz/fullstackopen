const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

//wraps it with the supertest function into a superagent object
//obj is assigned to the api variable and tests can use it for making HTTP requests to the backend
const api = supertest(app)
const Note = require('../models/note')


beforeEach(async () => {
  //clear out database at beginning
  await Note.deleteMany({})

  //save the two notes stored in the initialNotes array to the database
  //ensure that the database is in the same state before every test is run
  //noteObjects variable is assigned to an array of Mongoose objects that are created with
  //the Note constructor for each of the notes in the helper.initialNotes array
  const noteObjects = helper.initialNotes
    .map(note => new Note(note))
  //create new array consist of promises by calling save method of each item in the noteObjects array
  //it is an array of promises for saving each of the items to the database

  const promiseArray = noteObjects.map(note => note.save())
  //wait for all of the asynchronous operations to finish executing
  //Promise.all method can be used for transforming an array of promises into a single promise
  //and waits until every promise for saving a note is finished, meaning that the database has been initialized.
  await Promise.all(promiseArray)
})

//adding a new note
test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const notesAtEnd = await helper.notesInDb()
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

  const contents = notesAtEnd.map(n => n.content)
  expect(contents).toContain(
    'async/await simplifies making async calls'
  )
})


//note without content will not be save into the database
test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const notesAtEnd = await helper.notesInDb()

  expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
})


test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    //checking the status code
    .expect(200)
    //Checking the value of the header
    .expect('Content-Type', /application\/json/)
}, 5000)



//return all notes
test('all notes are returned', async () => {
  const response = await api.get('/api/notes')

  expect(response.body).toHaveLength(helper.initialNotes.length)
})


//return a specific note
test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  //create an array containing the content of every note returned by the API
  const contents = response.body.map(r => r.content)
  //checking that the note given to it as a parameter is in the list of notes returned by the API
  expect(contents).toContain(
    'Browser can execute only JavaScript'
  )
})


//fetching an individual note
test('a specific note can be viewed', async () => {
  //fetch a note from db
  const notesAtStart = await helper.notesInDb()
  const noteToView = notesAtStart[0]

  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(resultNote.body).toEqual(noteToView)
})


//deleting an individual note
test('a note can be deleted', async () => {
  const notesAtStart = await helper.notesInDb()
  const noteToDelete = notesAtStart[0]

  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)

  const notesAtEnd = await helper.notesInDb()

  expect(notesAtEnd).toHaveLength(
    helper.initialNotes.length - 1
  )

  const contents = notesAtEnd.map(r => r.content)

  expect(contents).not.toContain(noteToDelete.content)
})

//close database connection
afterAll(async () => {
  await mongoose.connection.close()
})