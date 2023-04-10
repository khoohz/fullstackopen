require('dotenv').config()

const express = require('express') //built-in Node's web server module
const app = express()

app.use(express.json())
app.use(express.static('build'))

const morgan = require('morgan')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const cors = require('cors')
app.use(cors())

morgan.token('body', (request, response) => JSON.stringify(request.body))

//importing mongoDB module
const Person = require('./models/persons')

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
})})



// const maxId = () => {
//     const maxId = persons.length > 0
//         ? Math.max(...persons.map(id => id.id))
//         : 0
//     return maxId
// }

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
    Person.findById(request.params.id).then(person => {
        response.json(person)
      })
})


// const generateId = () => {
//     const min = Math.ceil(maxId() + 1)
//     const max = Math.floor(1000)
//     const newId = Math.floor(Math.random() * (max - min) + min)
//     return newId
// }

app.post('/api/persons', (request, response) => {
    
    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number
    })


    if(!body.name){
        return response.status(404).json({ 
            error: 'name missing' 
        })}
    else if(!body.number){
        return response.status(404).json({ 
            error: 'number missing' 
        })}
    else if(persons.find(persons => persons.name === person.name && persons.name.length > 0)){
        return response.status(404).json({ 
            error: 'name must be unique'
        })}

    person.save().then(savedPerson => {
    response.json(savedPerson)
    })

})

app.delete('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id)
    persons = persons.filter(persons => persons.id !== id)

    response.status(204).end()

})

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})