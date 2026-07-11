import COURSES from '../courses.json';

export function CourseCard({courseId, status, onClick}) { 
  const course = COURSES[courseId];

  if (!course) {
    console.warn("Unknown courseId:", courseId);
    return null;
  }

  return (
    <div className={`course-card ${status}`} onClick={onClick}>
      <p className='courseId'>{courseId}</p>
      <p className='courseTitle'>{course.name}</p>
      <p className='creditHours'>{course.hours} credits</p>
      <p className='status'>Status: {status}</p>
    </div>
  )
}