import { useState } from 'react';
import { useCourseTracker } from './useCourseTracker';
import { CourseColumn } from './components/CourseColumn';
import MAJORS from './majors.json';
import './App.css';

function App() {
  const [selectedMajor, setSelectedMajor] = useState(null);
  const {takenCourses, availableCourses, lockedCourses, addCourse, removeCourse} = useCourseTracker(selectedMajor);

  if (!selectedMajor) {
    return (
      <div className="major-selection">
        <h1>prereqd</h1>
        <h1>Select your major</h1>
        <select onChange={(e) => setSelectedMajor(e.target.value)} defaultValue="">
          <option value="" disabled>Choose a major...</option>
          {Object.keys(MAJORS).map(major => (
            <option key={major} value={major}>{major}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      <h1>prereqd</h1>
      <h1>{selectedMajor}</h1>
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
  );
}

export default App;