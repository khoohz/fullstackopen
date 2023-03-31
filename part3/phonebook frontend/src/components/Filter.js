const Filter = ({filter, handleFilter}) => {
    
    return (
        <div>
            search: <input value={filter} onChange={handleFilter} />
        </div>
    )
}

export default Filter 