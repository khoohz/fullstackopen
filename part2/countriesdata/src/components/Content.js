import Countries from './Countries'

const Content = ({filter, filtered, countries, flag, setFlag, show, setShow}) => {

    const handleShow = (flag) => {
        setShow(true)
        setFlag(flag)
    }
    
    if (filtered.length <= 10 && filtered.length > 1 && show === false){
        return (
            <div>
                <p> </p>
                {filtered.map(country =>
                <div key={country.flag}>
                    {country.name.common}
                    <button onClick={() => handleShow(country.flag)}>show</button>
                </div>
                )}
            </div>
        )
    } else if (filtered.length > 10 && filter.length >= 1) {
        return (
            <div>
                Too many matches, specify another filter
            </div>
        )
    } else if (filter.length <= 1) {
        return(
            <div>
                Insert to search for countries
            </div>
        )
    } else if (filtered.length === 1 || show === true) {
        return (
            <>
                <Countries filtered={filtered} countries={countries} 
                show={show} setShow={setShow} />
            </>
        )
    }

}

export default Content
    
    
    
    