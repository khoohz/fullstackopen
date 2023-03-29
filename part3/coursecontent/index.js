const express = require('express') //built-in Node's web server module
const app = express()
app.use(express.static('build'))

//express json-parser
app.use(express.json())

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]

//routes to app
//handle HTTP GET request made to /root
app.get('/', (request, response) => { //request: info of HTTP request, response: how request is responded to 
    //server respond to HTTP req by 
    //sending response containing <h1>
    response.send('<h1>Hello World!</h1>')
  })

//handle HTTP GET request made to notes path of app
app.get('/api/notes', (request, response) => {
    //server respond to HTTP req with JSON method
    //send notes array passed as JSON string
    response.json(notes)
})

//fetching a single resource
app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

//handle post request
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  
  //access data from body property of request object
  //takes JSON data of request, transform into JS obj 
  //attaches to the body property of request obj
  const body = request.body
  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }


  notes = notes.concat(note)

  response.json(note)
})

//deleting resources
app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

//used to debug -> find content-type header (content-type in body of request)
// console.log(request.headers) 