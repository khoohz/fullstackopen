const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://khoohz:${password}@cluster.pgrxpgn.mongodb.net/phoneBook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

//defining schema for a note and the matching model
//schema maps to a MongoDB collectiona and defines the shape of doc within that collection
//schema tells Monogoose how the note obj are to be stored in the database
const noteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  number: {
    type: String,
    required: true,
    unique: true
  }
})

//Note model (singular name) used to create new note object
//Models -> constructor fx
const Note = mongoose.model('Note', noteSchema)

if (process.argv.length>=4) {
//note (if plural = collections)
  const note = new Note({
    name: process.argv[3],
    number: process.argv[4],
  })

  //save obj to database, close database connection to end execution
  note.save().then(result => {
    console.log(`added ${note.name} ${note.number} to phonebook`)
    
  })
  .catch((error) => {
    console.log('Please fill in both unique name and number:', error.message)
    mongoose.connection.close()
  })
} else {
  //fetching obj from database (db)
  Note.find({}).then(result => {
    console.log("phonebook:")
    result.forEach(note => {
      console.log(`${note.name} ${note.number}`)
    })
    mongoose.connection.close()
  })
}




