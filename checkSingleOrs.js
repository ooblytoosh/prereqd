// fix-single-or-to-and.js
import fs from 'fs';
import COURSES from './src/courses.json' with { type: 'json' };

function fixSingleOr(prereqs) {
  if (!prereqs || typeof prereqs === 'string') return prereqs;

  if (prereqs.or) {
    const fixedItems = prereqs.or.map(fixSingleOr);
    if (fixedItems.length === 1) {
      return { and: fixedItems }; // relabel single-item "or" as "and"
    }
    return { or: fixedItems };
  }

  if (prereqs.and) {
    const fixedItems = prereqs.and.map(fixSingleOr);
    return { and: fixedItems };
  }

  return prereqs;
}

const fixedCourses = {};
for (const [courseId, course] of Object.entries(COURSES)) {
  fixedCourses[courseId] = {
    ...course,
    prereqs: course.prereqs ? fixSingleOr(course.prereqs) : course.prereqs,
  };
}

fs.writeFileSync('./src/courses.fixed.json', JSON.stringify(fixedCourses, null, 2));
console.log('Done. Wrote courses.fixed.json — review it, then rename to replace courses.json.');