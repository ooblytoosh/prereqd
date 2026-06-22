import COURSES from './COURSES.json';
import { useCourseTracker } from './useCourseTracker';
import {useEffect, useState} from 'react';
import './App.css';

//course card component
function CourseCard({courseId, status, onClick}) { 
  const course = COURSES[courseId];

  return (
    <div className={`course-card ${status}`} onClick={onClick}>
      <p className='courseId'>{courseId}</p>
      <p className='courseTitle'>{course.name}</p>
      <p className='status'>Status: {status}</p>
      <p className='prereqs'>Prereqs: {course.prereqs.length > 0 ? course.prereqs.join(', ') : "None"}</p>
    </div>
  )
}

//course column component
function CourseColumn({title, count, courses, status, onCardClick}) {
  return (
    <div>
      <h2>{title}: {count}</h2>
      {courses.map(courseId => {
        return <CourseCard 
          key={courseId}
          courseId={courseId}
          status={status}
          onClick={() => onCardClick(courseId)}
        />;
      })}
    </div>
  )
}

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