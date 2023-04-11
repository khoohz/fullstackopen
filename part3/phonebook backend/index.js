require('dotenv').config()

const express = require('express') //built-in Node's web server module
const bodyParser = require('body-parser') 
const app = express()

app.use(express.static('build'))
app.use(express.json())
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
    
    Person.find({}).then(persons => {
        response.send(
            `<div>
                <div>Phonebook has info for ${persons.length} people</div>
                <div>${currentTime}</div>
            </div>`
        )
    })
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons.map(person => person.toJSON()))
})})


app.post('/api/persons', (request, response, next) => {
    
    const body = request.body

    // if(body.name === undefined){
    //     return response.status(404).json({ 
    //         error: 'name missing' 
    //     })}
    // else if(body.number === undefined){
    //     return response.status(404).json({ 
    //         error: 'number missing' 
    //     })}
    // else if(persons.find(persons => persons.name === body.name && persons.name.length > 0)){
    //     return response.status(404).json({ 
    //         error: 'name must be unique'
    //     })}

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
        .then(person => {
            if (person) {
            response.json(person.toJSON())
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

app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body
  
    Person.findByIdAndUpdate(request.params.id, {name, number}, {new: true, runValidators: true, context: 'query'})
        .then(updatedPerson => {
            response.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))
  })


// handler of requests with unknown endpoint (placed after all HTTP request handler)
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


// handler of requests with result to errors
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