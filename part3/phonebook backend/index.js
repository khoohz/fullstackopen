require('dotenv').config()

const express = require('express') //built-in Node's web server module
const bodyParser = require('body-parser') 
const app = express()

app.use(express.json())
app.use(express.static('build'))
app.use(bodyParser.json())

const morgan = require('morgan')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const cors = require('cors')
app.use(cors())

morgan.token('body', (request, response) => JSON.stringify(request.body))

//importing mongoDB module
const Person = require('./models/person')

let persons = []


app.get('/info', (request, response) => {
    const currentTime = Date().toLocaleString()

    response.send(
        `<div>
            <div>Phonebook has info for ${persons.length} people</div>
            <div>${currentTime}</div>
        </div>`
    )
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons.map(person => person.toJSON()))
})})



// const maxId = () => {
//     const maxId = persons.length > 0
//         ? Math.max(...persons.map(id => id.id))
//         : 0
//     return maxId
// }



// const generateId = () => {
//     const min = Math.ceil(maxId() + 1)
//     const max = Math.floor(1000)
//     const newId = Math.floor(Math.random() * (max - min) + min)
//     return newId
// }

app.post('/api/persons', (request, response, next) => {
    
    const body = request.body

    if(body.name === undefined){
        return response.status(404).json({ 
            error: 'name missing' 
        })}
    else if(body.number === undefined){
        return response.status(404).json({ 
            error: 'number missing' 
        })}
    else if(persons.find(persons => persons.name === body.name && persons.name.length > 0)){
        return response.status(404).json({ 
            error: 'name must be unique'
        })}

    const person = new Person({
        name: body.name,
        number: body.number
    })
    
    person.save()
        .then(savedPerson => {
            response.json(savedPerson.toJSON())
        })
        .catch(error => next(error))
})



app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(note => {
            if (note) {
            response.json(note.toJSON())
            } else {
            response.status(404).end()
            }
        })
        .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {

    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
      })
      .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
      return response.status(400).send({ error: 'malformatted id' })
    }  else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }
  
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})