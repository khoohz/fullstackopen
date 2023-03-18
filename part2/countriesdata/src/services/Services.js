import axios from "axios"
const baseUrl = 'https://restcountries.com/v3.1/all'
const apiKey = process.env.REACT_APP_API_KEY
const testingUrl = 'http://localhost:3001/weather'
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=`
const iconUrl = `https://openweathermap.org/img/wn/`

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data) 
}

const getWeather = (capital) => {
    const request = axios.get(`${weatherUrl}${capital}&appid=${apiKey}`)
    return request.then(response => response.data) 
}


export default {getAll, getWeather}