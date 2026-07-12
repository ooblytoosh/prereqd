import {CourseCard} from './CourseCard';

export function CourseColumn({title, count, courses, status, choiceGroupInfo, onCardClick = () => {}}) {
  return (
    <div>
      <h2>{title}: {count}</h2>
      {courses.map(courseId => {
        let group;
        if (choiceGroupInfo) {
          group = choiceGroupInfo.get(courseId)
        }
        return <CourseCard 
          key={courseId}
          courseId={courseId}
          status={status}
          choiceGroup={group}
          onClick={() => onCardClick(courseId)}
        />;
      })}
    </div>
  )
}