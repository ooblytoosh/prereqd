import { CourseCard } from './CourseCard';

export function CourseColumn({title, count, courses, status, choiceGroupInfo, getMissingPrereqsFor, onCardClick = () => {}, searchTerm, onSearchChange}) {
  return (
    <div>
      <h2>{title}: {count}</h2>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="column-search"
      />
      {courses.map(courseId => {
        let group;
        if (choiceGroupInfo) {
          group = choiceGroupInfo.get(courseId);
        }
        return <CourseCard 
          key={courseId}
          courseId={courseId}
          status={status}
          choiceGroup={group}
          missingPrereqs={getMissingPrereqsFor ? getMissingPrereqsFor(courseId) : null}
          onClick={() => onCardClick(courseId)}
        />;
      })}
    </div>
  );
}