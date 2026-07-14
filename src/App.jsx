import { useState } from 'react';
import { useCourseTracker } from './useCourseTracker';
import { CourseColumn } from './components/CourseColumn';
import { PoolCard } from './components/PoolCard';
import { ProgressBar } from './components/ProgressBar'
import COURSES from './courses.json'
import MAJORS from './majors.json';
import './App.css';

function filterCourses(courseIds, searchTerm) {
  if (!searchTerm.trim()) return courseIds;
  const lower = searchTerm.toLowerCase();

  return courseIds.filter(courseId => {
    const course = COURSES[courseId];
    const idMatch = courseId.toLowerCase().includes(lower);
    const titleMatch = course?.title?.toLowerCase().includes(lower);
    return idMatch || titleMatch;
  });
}

function App() {
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [takenSearch, setTakenSearch] = useState("");
  const [availableSearch, setAvailableSearch] = useState("");
  const [lockedSearch, setLockedSearch] = useState("");
  const {
    takenCourses, 
    availableCourses, 
    lockedCourses, 
    choiceGroupInfo, 
    poolProgress, 
    creditsCompleted, 
    totalCredits,
    addCourse, 
    removeCourse,
    resetProgress,
    getMissingPrereqsFor
  } = useCourseTracker(selectedMajor);

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
      <ProgressBar completed={creditsCompleted} total={totalCredits}/>
      <div className="button-row">
        <button className="reset-button" onClick={resetProgress}>Reset Progress</button>
        <button className="revert-major" onClick={() => setSelectedMajor(null)}>Change Major</button>
      </div>
      <div className="lists">
        <CourseColumn 
          title="Taken"
          count={takenCourses.size}
          courses={filterCourses([...takenCourses], takenSearch)}
          status="taken"
          onCardClick={removeCourse}
          searchTerm={takenSearch}
          onSearchChange={setTakenSearch}
        />
        <CourseColumn 
          title="Available"
          count={availableCourses.length}
          courses={filterCourses(availableCourses, availableSearch)}
          status="available"
          choiceGroupInfo={choiceGroupInfo}
          onCardClick={addCourse}
          searchTerm={availableSearch}
          onSearchChange={setAvailableSearch}
        />
        <CourseColumn 
          title="Locked"
          count={lockedCourses.length}
          courses={filterCourses(lockedCourses, lockedSearch)}
          status="locked"
          choiceGroupInfo={choiceGroupInfo}
          getMissingPrereqsFor={getMissingPrereqsFor}
          searchTerm={lockedSearch}
          onSearchChange={setLockedSearch}
        />
      </div>

      <div className="pool-section">
        <h2>Degree Pool Requirements</h2>
        {poolProgress.map(pool => {
          return <PoolCard key={pool.name} pool={pool} />
        })}
      </div>
    </div>
  );
}

export default App;