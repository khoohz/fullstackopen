import Header from './Header'
import Content from './Content'
import Total from './Total'

const Course = ({course}) => {
    return (
      <div>
        {course.map(courses =>
            <div key={courses.id}>
                <h1>Web development curriculum</h1>
                <Header course={courses} />
                <Content course={courses} />
                <Total course={courses} />
            </div>
        )}
      </div>
    )
}

export default Course