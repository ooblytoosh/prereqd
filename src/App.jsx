import COURSES from './COURSES.json';

const takenCourses = new Set();

function isUnlocked(courseId) {
  return COURSES[courseId].prereqs.every(prereq => takenCourses.has(prereq))
}



function App() {
  const availablCourses = [];
  const lockedCourses = [];

  for (const courseId of Object.keys(COURSES)) {
    if (takenCourses.has(courseId)) {
      continue
    }
    if (isUnlocked(courseId)) {
      availablCourses.push(courseId);
    } else {
      lockedCourses.push(courseId);
    }
  }

  return <h1>Degree Tree</h1>
}

export default App