const Contactform = ({addPerson, newName, newNumber, handleNameChange, handleNumChange}) => {
    return (
        <form onSubmit={addPerson}>
        <div>
          name: <input id="inputName" value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input id="inputNumber" value={newNumber} onChange={handleNumChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}

export default Contactform