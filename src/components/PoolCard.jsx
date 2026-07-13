import COURSES from '../courses.json'

export function PoolCard({ pool }) {
  return (
    <div className="pool-card">
      <h3>{pool.name}</h3>
      <p>{pool.hoursCompleted} / {pool.creditHours} hrs</p>
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
    </div>
  );
}