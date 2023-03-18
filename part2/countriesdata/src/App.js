import { useState, useEffect } from 'react'
import Services from './services/Services'
import Content from './components/Content'


const App = () => {

  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [filtered, setFiltered] = useState([])
  const [flag, setFlag] = useState('')
  const [show, setShow] = useState(false)
    

  const hook = () => {
    console.log('fetching data from server...')
    if(countries){
      Services
      .getAll()
      .then(results =>
        setCountries(results))
        console.log('fetching completed')
      }
  }

  useEffect(hook, [])

  if (countries && countries.length < 0) {
    return null
  }

  const handleFilter = (event) => {
    setFlag('')
    setShow(false)
    setFilter(event.target.value)
    const filters = event.target.value.toLowerCase()

    if(filters) {
      const strCountries = JSON.stringify(countries)
      const filteredResult = countries.filter(country => 
        country.name.common.toLowerCase().includes(filters))
      setFiltered(filteredResult)
    } else {
      setFiltered(countries)
    }
  }


  return(
    <div>
      <div>
        find countries <input value={filter} onChange={handleFilter} />
      </div>
      <Content filter={filter} filtered={filtered} setFiltered={setFiltered} 
      countries={countries} flag={flag} setFlag={setFlag}
      show={show} setShow={setShow} />
      
    </div>
  )
}

export default App;
