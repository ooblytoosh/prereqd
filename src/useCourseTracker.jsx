import { useState, useEffect } from 'react';
import COURSES from './courses.json';

export function useCourseTracker() {
  const [takenCourses, setTakenCourses] = useState(() => {
    const saved = localStorage.getItem('takenCourses');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem('takenCourses', JSON.stringify([...takenCourses]));
  }, [takenCourses]);

  const availableCourses = [];
  const lockedCourses = [];

  for (const courseId of Object.keys(COURSES)) {
    if (takenCourses.has(courseId)) continue;

    if (COURSES[courseId].prereqs.every(prereq => takenCourses.has(prereq))) {
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
        for (const id of Object.keys(COURSES)) {
          if (COURSES[id].prereqs.includes(current)) {
            queue.push(id);
          }
        }
      }
    }

    setTakenCourses(next);
  };

  return {takenCourses, availableCourses, lockedCourses, addCourse, removeCourse};
}