import COURSES from '../courses.json'

export function PoolCard({ pool }) {
  return (
    <details className="pool-card">
      <summary>
        {pool.name} — {pool.hoursCompleted} / {pool.creditHours} hrs
      </summary>
      <ul>
        {pool.options.map(courseId => {
          const course = COURSES[courseId];
          if (!course) return null;
          const isTaken = pool.takenInPool.includes(courseId);
          return (
            <li key={courseId} className={isTaken ? "pool-course taken" : "pool-course"}>
              <span className="checkmark">{isTaken ? "✓" : "☐"}</span>
              {courseId} : {course.name} ({course.hours})
            </li>
          );
        })}
      </ul>
    </details>
  );
}