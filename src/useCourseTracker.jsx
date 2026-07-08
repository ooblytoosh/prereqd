import { useState, useEffect } from 'react';
import COURSES from './courses.json';
import MAJORS from './majors.json';

function extractCourseIds(prereqs) {
  if (typeof prereqs === 'string') {
    return [prereqs];
  }
  if (!prereqs || Object.keys(prereqs).length === 0) {
    return [];
  }

  const items = prereqs.and || prereqs.or
  let ids = [];

  for (const item of items) {
    if (typeof item === 'string') {
      ids.push(item);
    } else {
      ids = ids.concat(extractCourseIds(item));
    }
  }
  return ids;
}

function getRelevantCourses(majorCourses) {
  const relevant = new Set(majorCourses);
  const queue = [...majorCourses];

  while (queue.length > 0) {
    const courseId = queue.shift();
    const course = COURSES[courseId];
    if (!course) {
      console.warn(`Missing course: ${courseId}`);
      continue;
    }

    const prereqIds = extractCourseIds(course.prereqs);
    for (const prereqId of prereqIds) {
      if (!relevant.has(prereqId)) {
        relevant.add(prereqId);
        queue.push(prereqId);
      }
    }
  }
  return relevant;
}

function isSatisfied(prereqs, takenCourses) {
  if (Object.keys(prereqs).length === 0) {
    return true
  }

  if (prereqs.and) {
    return prereqs.and.every(prereq => {
      if (typeof prereq === "string") {
        return takenCourses.has(prereq)
      }
      return isSatisfied(prereq, takenCourses)
    });
  }

  if (prereqs.or) {
    return prereqs.or.some(prereq => {
      if (typeof prereq === "string") {
        return takenCourses.has(prereq);
      }
      return isSatisfied(prereq, takenCourses)
    })
  }

  return true;
}


export function useCourseTracker(selectedMajor) {
  const [takenCourses, setTakenCourses] = useState(() => {
    const saved = localStorage.getItem('takenCourses');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem('takenCourses', JSON.stringify([...takenCourses]));
  }, [takenCourses]);

  const relevantCourses = selectedMajor ? getRelevantCourses(MAJORS[selectedMajor].courses) : new Set();
  const availableCourses = [];
  const lockedCourses = [];

  for (const courseId of relevantCourses) {
    if (takenCourses.has(courseId)) continue;

    const course = COURSES[courseId];
    if (!course) {
      continue
    }

    if (isSatisfied(course.prereqs, takenCourses)) {
      availableCourses.push(courseId);
    } else {
      lockedCourses.push(courseId);
    }
  }

  const addCourse = (courseId) => {
    const next = new Set(takenCourses);
    next.add(courseId);
    setTakenCourses(next);
  };

  const removeCourse = (courseId) => {
    const next = new Set(takenCourses);
    const queue = [courseId];

    while (queue.length > 0) {
      const current = queue.shift();
      if (next.has(current)) {
        next.delete(current);
        for (const courseId of next) {
          if (!isSatisfied(COURSES[courseId].prereqs, next)) {
            queue.push(courseId);
          }
        }
      }
    }

    setTakenCourses(next);
  };

  return {takenCourses, availableCourses, lockedCourses, addCourse, removeCourse};
}