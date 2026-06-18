import COURSES from './COURSES.json';
import {useState} from 'react';
import './App.css';

function takeCourse(takenCourses, setTakenCourses, courseId) {
    setTakenCourses(new Set([...takenCourses, courseId]));
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

  const takenList = [...takenCourses].map(courseId => <li key={courseId}>{courseId}</li>);
  const availableList = availableCourses.map(courseId => <li key={courseId} onClick={() => takeCourse(takenCourses, setTakenCourses, courseId)}>{courseId}</li>);
  const lockedList = lockedCourses.map(courseId => <li key={courseId}>{courseId}</li>);

  return (
    <div>
      <h1>Degree Tree</h1>
      <div className="lists">
        <div>
          <h2>Taken</h2>
          <ul>{takenList}</ul>
        </div>
        <div>
          <h2>Available</h2>
          <ul>{availableList}</ul>
        </div>
        <div>
          <h2>Locked</h2>
          <ul>{lockedList}</ul>
        </div>
      </div>
    </div>
  )
}

export default App