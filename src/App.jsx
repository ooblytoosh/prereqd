import { useCourseTracker } from './useCourseTracker';
import {CourseColumn} from './components/CourseColumn';
import './App.css';

//main app function
function App() {

  const {takenCourses, availableCourses, lockedCourses, addCourse, removeCourse} = useCourseTracker();

  return (
    <div>
      <h1>prereqd</h1>
      <h1>Major: Aerospace Engineering</h1>
      <div className="lists">
        <CourseColumn 
          title="Taken"
          count={takenCourses.size}
          courses={[...takenCourses]}
          status="taken"
          onCardClick={removeCourse}
        />
        <CourseColumn 
          title="Available"
          count={availableCourses.length}
          courses={availableCourses}
          status="available"
          onCardClick={addCourse}
        />
        <CourseColumn 
          title="Locked"
          count={lockedCourses.length}
          courses={lockedCourses}
          status="locked"
        />
      </div>
    </div>
  )
}

export default App