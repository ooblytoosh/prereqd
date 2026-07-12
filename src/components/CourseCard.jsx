import COURSES from '../courses.json';

export function CourseCard({courseId, status, choiceGroup, onClick}) { 
  const course = COURSES[courseId];

  return (
    <div className={`course-card ${status}`} onClick={onClick}>
      <p className='courseId'>{courseId}</p>
      <p className='courseTitle'>{course.name}</p>
      {choiceGroup && (
        <span className="badge">choose 1 of {choiceGroup.groupSize}</span>
      )}
      <p className='creditHours'>{course.hours} credits</p>
      <p className='status'>Status: {status}</p>
    </div>
  )
}