const Total = ({course}) => {
    const total = course.parts.map(sum => sum.exercises)
    const sum = total.reduce((a, b) => a + b, 0)

    return(
        <div>
            <b>
               total of {sum} exercises
            </b>
        </div>
        
    )
}

export default Total


