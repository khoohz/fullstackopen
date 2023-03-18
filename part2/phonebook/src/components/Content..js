const Content = ({persons, filtered, handleDelete}) => {
    if (filtered.length > 0){
        return(
            <div>
                {filtered.map(person =>
                    <div key={person.id}>
                        {person.name} {person.number}
                        <button type="submit" onclick={() => handleDelete(person.name)}>delete</button>
                    </div>
                )}
            </div>
        )
    } else {
        return(
            <div>
                {persons.map(person =>
                    <div key={person.id}>
                        {person.name} {person.number}
                        <button type="submit" onClick={() => handleDelete(person.id, person.name)}>delete</button>
                    </div>
                )}
            </div>
        )
    }
}

export default Content

