import { useState, useEffect } from "react"
import Services from "../services/Services"

const Weather = ({capital}) => {
    const [weathers, setWeathers] = useState([])
    const [icons, setIcons] = useState('')
    
    const hook = () => {
        Services
        .getWeather(capital)
        .then(results => {
            setWeathers(results)
            setIcons(results?.weather[0]?.icon)
            })
            console.log('fetching weather completed')
    }

    useEffect(hook, [capital])

    if (weathers.length < 0){
        return null
    } else {
    return(
        <>
            <h3>Weather in {capital}</h3>
            <p>temperature: {(weathers?.main?.temp -273.5).toFixed(2)} Celcius</p>
            <img src={`https://openweathermap.org/img/wn/${icons}@2x.png`} alt="Weather icon"></img>
            <div>wind: {weathers?.wind?.speed} m/s</div>
        </>
    )
    }

}

export default Weather