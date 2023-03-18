import Weather from './Weather'

const Countries = ({filtered, flag, show}) => {

    if (flag && show === true) {
        const filteredResult = filtered.filter(returnedFilter => returnedFilter.flag === flag)

        return(
            <div>
                <div>
                {filteredResult.map(data => {
                                const {name, capital, area,
                                languages, flag, flags} = data
    
                                return(
                                    <div key={flag}>
                                        <h2>{name.common}</h2>
                                        <div>capital: {capital}</div>
                                        <div>area: {area}</div>
                                        
                                        <p><strong>languages: </strong>{Object.values(languages).join(", ")}</p>
                                        <img src={flags.png} alt="Country flag"></img>
                                        <Weather capital={capital}/>
                                    </div>
                                )
                            })}
                </div>
            </div>
        )
}

    else {
        return(
        <div>
            <div>
            {filtered.map(data => {
                            const {name, capital, area,
                            languages, flag, flags} = data

                            return(
                                <div key={flag}>
                                    <h2>{name.common}</h2>
                                    <div>capital: {capital}</div>
                                    <div>area: {area}</div>
                                    
                                    <p><strong>languages: </strong>{Object.values(languages).join(", ")}</p>
                                    <img src={flags.png} alt="Country flag"></img>
                                    <Weather capital={capital}/>
                                </div>
                            )
                        })}
            </div>
        </div>
    )}
}

export default Countries