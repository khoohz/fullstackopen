import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'
import Contactform from './components/Contactform'
import Content from './components/Content.'
import Filter from './components/Filter'
import Notification from './components/Notification'


const App = () => {
  const [persons, setPersons] = useState([]) 

  const hook = () => {
    phonebookService
      .getAll()
      .then(initalPhonebook => setPersons(initalPhonebook))
  }

  useEffect(hook, [])


  const [newName, setNewName] = useState('')
  const [newNumber, setNewNum] = useState('')
  const [filter, setFilter] = useState('')
  const [filtered, setFiltered] = useState([])
  const [noti, setNoti] = useState(null) 


  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber,
    }

    if(persons.find(person => person.number === newPerson.number && person.number.length > 0)){
      alert(newNumber + " is already added to phonebook")
      document.getElementById("inputNumber").value=""
      return

    } else if (persons.find(person => person.name === newPerson.name && person.name.length > 0)){ 
        if (window.confirm(`${newPerson.name} is already added to phonebook, replace the old number with the new one?`))
        {
          const replacedName = persons.find(n => n.name === newPerson.name)
          const replacedNum = {...replacedName, number: newNumber}
          
          phonebookService
            .update(replacedNum.id, replacedNum)
            .then(returnedPerson=> {
              setPersons(persons.map( person => person.name !== newPerson.name ? person: returnedPerson ))  
              setNewName('')
              setNewNum('')
              setNoti(`${newPerson.name}'s contact successfully updated`)
              setTimeout(() => {
                setNoti(null)
              }, 4000)
          }).catch(error => {
            setNoti(`Information of ${newPerson.name} has already been removed from the server`)
            setTimeout(() => {
              setNoti(null)
            }, 4000)
          })
        }
      } else {
          phonebookService
            .create(newPerson)
            .then(returnedPerson => {
              setPersons(persons.concat(returnedPerson))
              setNewName('')
              setNewNum('')
              setNoti(`Added ${newPerson.name}'s contact`)
              setTimeout(() => {
                setNoti(null)
              }, 4000)
          })  
        }
  }

  const handleFilter = (event) => {
    setFilter(event.target.value)
    const filters = event.target.value.toLowerCase()
    let searchResult = persons.filter(names => 
      names.name.toLowerCase().indexOf(filters) > -1 )
    setFiltered(searchResult)
  }
  
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumChange = (event) => {
    setNewNum(event.target.value)
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)){
      phonebookService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(returnedNote => returnedNote.id !== id))
      })
    }
  }

  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification noti={noti}/>
      <Filter filter={filter} handleFilter={handleFilter} />
      <h3>Add new contact</h3>
      <Contactform addPerson={addPerson} newName={newName} newNumber={newNumber} 
      handleNameChange={handleNameChange} handleNumChange={handleNumChange} />
      <h3>Numbers</h3>
      <Content persons={persons} filtered={filtered} handleDelete={handleDelete} />
      
    </div>
  )
}

export default App