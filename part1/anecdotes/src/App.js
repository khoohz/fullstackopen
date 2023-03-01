import { useState } from 'react'

const Header = ({header}) => <h1>{header}</h1>

const Button = ({onclick, text}) => <button onClick={onclick}>{text}</button>

const MostVotes = ({votes, anecdotes}) => {
  const largestNum = Math.max(...votes)
  const largestIndex = votes.indexOf(largestNum)
  
  return (
    <div>
      <p>{anecdotes[largestIndex]}</p>
      <p>has {largestNum} votes</p>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)

  const [votes, setVotes] = useState (Array(8).fill(0))

  const handleAnec = () => {
    const copySelected = Math.floor(Math.random() * 7)
    setSelected(copySelected)
    console.log(votes)
  }
    
  const handleVote = () => {
    const copyVote = [...votes]
    copyVote[selected] += 1 
    
    setVotes(copyVote)
  }


  return (
    <div>
      <Header header = 'Anecdote of the day' />
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <Button onclick={handleVote} text="vote" />
      <Button onclick={handleAnec} text="next anecdote" />
      <Header header='Anecdote with most votes' />
      <MostVotes votes={votes} anecdotes={anecdotes} />
    </div>
    
  )
}

export default App