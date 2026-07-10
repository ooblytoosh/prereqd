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
      <div className="majors">
        <h1>prereqd</h1>
        <h1>Select your major</h1>
        <input
          list="majors"
          placeholder="Search for your major..."
          onChange={(e) => {
            if (MAJORS[e.target.value]) {
              setSelectedMajor(e.target.value);
            }
          }}
        />
        <datalist id="majors">
          {Object.keys(MAJORS).map(major => (
            <option key={major} value={major}/>
          ))}
        </datalist>
      </div>
    );
  }

  return (
    <div>
      <h1>prereqd</h1>
      <h1>{selectedMajor}</h1>
      <button className="revert-major" onClick={() => setSelectedMajor(null)}>Change Major</button>
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