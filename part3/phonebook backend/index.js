const express = require('express') //built-in Node's web server module
const app = express()

app.use(express.json())

const morgan = require('morgan')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const cors = require('cors')
app.use(cors())

// morgan(function (tokens, request, response) {
//     return [
//       tokens.method(request, response),
//       tokens.url(request, response),
//       tokens.status(request, response),
//       tokens.response(request, response, 'content-length'), '-',
//       tokens['response-time'](request, response), 'ms'
//     ].join(' ')
//   })

morgan.token('body', (request, response) => JSON.stringify(request.body))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})


const maxId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(id => id.id))
        : 0
    return maxId
}

app.get('/info', (request, response) => {
    const currentTime = Date().toLocaleString()

    response.send(
        `<div>
            <div>Phonebook has info for ${maxId()} people</div>
            <div>${currentTime}</div>
        </div>`
    )
})

app.get('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id)
    const person = persons.find(note => note.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }

})


const generateId = () => {
    const min = Math.ceil(maxId() + 1)
    const max = Math.floor(1000)
    const newId = Math.floor(Math.random() * (max - min) + min)
    return newId
}

app.post('/api/persons', (request, response) => {
    
    const body = request.body

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    if(!body.name){
        response.status(404).json({ 
            error: 'name missing' 
        })}
    else if(!body.number){
        response.status(404).json({ 
            error: 'number missing' 
        })}
    else if(persons.find(persons => persons.name === person.name && persons.name.length > 0)){
        response.status(404).json({ 
            error: 'name must be unique'
        })}
    else {
        persons = persons.concat(person)
    }

    response.json(persons)

})

app.delete('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)

    response.status(204).end()

})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})