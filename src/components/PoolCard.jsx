import COURSES from '../courses.json'

export function PoolCard({ pool }) {
  return (
    <details className="pool-card">
      <summary>
        {pool.name} — {pool.hoursCompleted} / {pool.creditHours} hrs
      </summary>
      <ul>
        {pool.options.map(courseId => {
          const isTaken = pool.takenInPool.includes(courseId);
          return (
            <li key={courseId} className={isTaken ? "pool-course taken" : "pool-course"}>
              <span className="checkmark">{isTaken ? "✓" : "☐"}</span>
              {courseId} : {COURSES[courseId].name}
            </li>
          );
        })}
      </ul>
    </details>
  );
}