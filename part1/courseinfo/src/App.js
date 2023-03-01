const Header = (props) => {
  return(
    <div>
      <h1>
        {props.course}
      </h1>
    </div>
  )
}


const Content = (props) => {
  return(
    <div>
      <Part part={props.parts[0].name} exercises={props.parts[0].exercises} />
      <Part part={props.parts[1].name} exercises={props.parts[1].exercises} />
      <Part part={props.parts[2].name} exercises={props.parts[2].exercises} />
    </div>
  )
}


const Part = (props) => {
  return(
    <div>
      <p>
        {props.part} {props.exercises}
      </p>
    </div>
  )
}


const Total = (props) => {
  return(
    <div>
      The total is {props.total}
    </div>
  )
}


const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}


export default App


// // import { useState } from 'react'

// // const Button = ({onClick, text}) => <button onClick={onClick}> {text} </button>


// // const Display = ({counter}) => <div> {counter} </div>

// // const App = () => {
// //   const [ counter, setCounter ] = useState(0)

// //   const increaseByOne = () => setCounter(counter + 1)

// //   const decreaseByOne = () => setCounter(counter - 1)
  
// //   const setToZero = () => setCounter(0)

// //   return (
// //     <div>
// //       <Display counter = {counter} />

// //       <Button onClick={increaseByOne} text = "plus" />
// //       <Button onClick={decreaseByOne} text = "minus" />
// //       <Button onClick={setToZero} text = "zero" />

// //     </div>
// //   )
// // }

// // export default App

// import { click } from '@testing-library/user-event/dist/click'
// import { useState } from 'react'

// const History = (props) => {
//   if (props.allClicks.length === 0) {
//     return (
//       <div>
//         the app is used by pressing the buttons
//       </div>
//     )
//   }
//   return (
//     <div>
//       button press history: {props.allClicks.join(' ')}
//     </div>
//   )
// }

// const Button = ({ handleClick, text }) => (
//   <button onClick={handleClick}>
//     {text}
//   </button>
// )

// const App = () => {
//   const [left, setLeft] = useState(0)
//   const [right, setRight] = useState(0)
//   const [allClicks, setAll] = useState([])
//   const [total, setTotal] = useState(0)

//   const handleLeftClick = () => {
//     setAll(allClicks.concat('L'))
//     setLeft(left + 1)
//     setTotal(total + 1)
//   }

//   const handleRightClick = () => {
//     setAll(allClicks.concat('R'))
//     setRight(right + 1)
//     setTotal(total + 1)
//   }

//   return (
//     <div>
//       {left}
//       <Button handleClick={handleLeftClick} text='left' />
//       <Button handleClick={handleRightClick} text='right' />
//       {right}

//       <History allClicks={allClicks}/>
//       <p>Total clicks: {total}</p>
//     </div>
//   )
// }

// export default App