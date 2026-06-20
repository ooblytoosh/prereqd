import COURSES from './COURSES.json';
import {useState} from 'react';
import './App.css';

function takeCourse(takenCourses, setTakenCourses, courseId) {
  setTakenCourses(new Set([...takenCourses, courseId]));
}

function CourseCard({courseId, status, onClick}) {
  const course = COURSES[courseId];

  return (
    <div className={`course-card ${status}`} onClick={onClick}>
      <p id='courseId'>{courseId}</p>
      <p id='courseTitle'>{course.name}</p>
      <p id='status'>Status: {status}</p>
      <p id='prereqs'>Prereqs: {course.prereqs.length > 0 ? course.prereqs.join(', ') : "None"}</p>
    </div>
  )
}

function App() {
  const [takenCourses, setTakenCourses] = useState(new Set());
  const availableCourses = [];
  const lockedCourses = [];

  for (const courseId of Object.keys(COURSES)) {
    if (takenCourses.has(courseId)) {
      continue
    }

    if (COURSES[courseId].prereqs.every(prereq => takenCourses.has(prereq))) {
      availableCourses.push(courseId);
    } else {
      lockedCourses.push(courseId);
    }
  }

  return (
    <div>
      <h1>prereqd</h1>
      <div className="lists">
        <div className="taken">
          <h2>Taken</h2>
          {[...takenCourses].map(courseId => 
            <CourseCard courseId={courseId} status='taken' />
          )}
        </div>
        <div>
          <h2>Available</h2>
          {[...availableCourses].map(courseId => 
            <CourseCard courseId={courseId} status='available' onClick={() => takeCourse(takenCourses, setTakenCourses, courseId)}/>
          )}
        </div>
        <div>
          <h2>Locked</h2>
          {[...lockedCourses].map(courseId => 
            <CourseCard courseId={courseId} status='locked' />
          )}
        </div>
      </div>
    </div>
  )
}

export default App