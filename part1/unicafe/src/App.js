import { useState } from 'react'

const Display = ({header}) => <h1>{header}</h1>

const Button = ({onclick, text}) => <button onClick={onclick}>{text}</button>

const StatisticLine = ({text, value}) => {
  if (text === 'positive'){
    return (
      <table>
        <tbody>
          <tr>
            <td>{text}</td>
            <td>{value.toFixed(2)}</td> 
            <td>%</td> 
          </tr>
        </tbody>
      </table>
    )
  } else if (text === 'average'){
      return (
        <table>
          <tbody>
            <tr>
              <td>{text}</td>
              <td>{value.toFixed(2)}</td> 
            </tr>
          </tbody>
        </table>
    )
  } else {
      return (
        <table>
          <tbody>
            <tr>
              <td>{text}</td>
              <td>{value}</td> 
            </tr>
          </tbody>
        </table>
      )
  }
}  

const Statistics = ({clicks}) => {
  const average = (clicks.good-clicks.bad)/(clicks.total)
  const positive = (clicks.good)*(100/clicks.total)
  
  if (clicks.total === 0) {
    return (
      <div>
        no feedback given
      </div>
    )
    }
  else {
    return (
      <div>
        <StatisticLine text="good" value ={clicks.good} />
        <StatisticLine text="neutral" value ={clicks.neutral} />
        <StatisticLine text="bad" value ={clicks.bad} />
        <StatisticLine text="all" value ={clicks.total} />
        <StatisticLine text="average" value ={average} />
        <StatisticLine text="positive" value ={positive} />
      </div>
    )
  }
}

const App = () => {
  // save clicks of each button to its own state
  const [clicks, setClicks] = useState({
    good: 0, neutral: 0, bad: 0, total: 0 
  })

  const handleGood = () => {
    const newClicks = {
      ...clicks,
      good: clicks.good + 1, 
      total: clicks.total + 1
    }
    setClicks(newClicks)
  }
  const handleNeutral = () => {
    const newClicks = {
      ...clicks,
      neutral: clicks.neutral + 1,
      total: clicks.total + 1
    }
    setClicks(newClicks)
  }
  const handleBad = () => {
    const newClicks = {
      ...clicks,
      bad: clicks.bad + 1,
      total: clicks.total + 1
    }
    setClicks(newClicks)
  }

  return (
    <div>
      <Display header='give feedback' />
      <Button onclick={handleGood} text='good' />
      <Button onclick={handleNeutral} text='neutral' />
      <Button onclick={handleBad} text='bad' />

      <Display header='statistics' />
      <Statistics clicks={clicks} />
    </div>
  )
}

export default App

