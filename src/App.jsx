import { useState } from 'react';
import { useCourseTracker } from './useCourseTracker';
import { CourseColumn } from './components/CourseColumn';
import { PoolCard } from './components/PoolCard';
import { ProgressBar } from './components/ProgressBar'
import MAJORS from './majors.json';
import './App.css';

function App() {
  const [selectedMajor, setSelectedMajor] = useState(null);
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
    resetProgress
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
      <button className="reset-button" onClick={resetProgress}>Reset Progress</button>
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
          choiceGroupInfo={choiceGroupInfo}
          onCardClick={addCourse}
        />
        <CourseColumn 
          title="Locked"
          count={lockedCourses.length}
          courses={lockedCourses}
          status="locked"
          choiceGroupInfo={choiceGroupInfo}
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