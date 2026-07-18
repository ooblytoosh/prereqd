import { useState } from 'react';
import COURSES from '../courses.json';

export function CourseCard({ courseId, status, choiceGroup, missingPrereqs, onClick }) {
  const [showMissing, setShowMissing] = useState(false);
  const course = COURSES[courseId];

  const handleClick = () => {
    if (status === "locked") {
      setShowMissing(prev => !prev);
    } else {
      onClick();
    }
  };

  return (
    <div className={`course-card ${status}`} onClick={handleClick}>
      <p className="courseId">{courseId}</p>
      <p className="courseTitle">{course.name}</p>
      {choiceGroup && (
        <span className="badge">choose {choiceGroup.count} of {choiceGroup.groupSize}</span>
      )}
      <p className="creditHours">{course.hours} credits</p>
      <p>Status: {status}</p>
      {status === "locked" && showMissing && missingPrereqs?.length > 0 && (
        <ul className="missing-prereqs">
          {missingPrereqs.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}