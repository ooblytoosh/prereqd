import {CourseCard} from './CourseCard';

export function CourseColumn({title, count, courses, status, onCardClick = () => {}}) {
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