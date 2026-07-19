import { useState, useEffect } from 'react';
import COURSES from './courses.json';
import MAJORS from './majors.json';
import THREADS from './threads.json';

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

function flattenRequirementCourses(requirements) {
  const ids = [];

  for (const req of requirements) {
    if (req.type === "single") {
      ids.push(req.course)
    } else if (req.type === "choose") {
      ids.push(...req.options)
    } else if (req.type === "pool") {
      ids.push(...req.options)
    }
  }

  return ids;
}

function getMootCourses(requirements, takenCourses) {
  const singleCourses = new Set(
    requirements.filter(r => r.type === "single").map(r => r.course)
  );

  const satisfiedIn = new Map();

  for (const req of requirements) {
    if (req.type === "choose") {
      const takenCount = req.options.filter(c => takenCourses.has(c)).length;
      const satisfied = takenCount >= req.count;
      for (const opt of req.options) {
        if (!satisfiedIn.has(opt)) satisfiedIn.set(opt, []);
        satisfiedIn.get(opt).push(satisfied);
      }
    } else if (req.type === "pool") {
      const takenInPool = req.options.filter(c => takenCourses.has(c));
      const hoursCompleted = takenInPool.reduce((sum, id) => {
        return sum + (COURSES[id]?.hours || 0);
      }, 0);
      const satisfied = hoursCompleted >= req.creditHours;
      for (const opt of req.options) {
        if (!satisfiedIn.has(opt)) satisfiedIn.set(opt, []);
        satisfiedIn.get(opt).push(satisfied);
      }
    }
  }

  const moot = new Set();
  for (const [courseId, flags] of satisfiedIn) {
    if (takenCourses.has(courseId)) continue;
    if (singleCourses.has(courseId)) continue;
    if (flags.every(Boolean)) moot.add(courseId);
  }
  return moot;
}

function buildChoiceGroupInfo(requirements) {
  const info = new Map();
  for (const req of requirements) {
    if (req.type === "choose") {
      for (const opt of req.options) {
        info.set(opt, { "groupSize": req.options.length, "count": req.count })
      }
    }
  }

  return info;
}

function getPoolProgress(requirements, takenCourses) {
  const pools = [];

  for (const req of requirements) {
    if (req.type === "pool") {
      const takenInPool = req.options.filter(c => takenCourses.has(c));
      const hoursCompleted = takenInPool.reduce((sum, courseId) => {
        const course = COURSES[courseId];
        return sum + (course?.hours || 0);
      }, 0);

      pools.push({
        "name": req.name,
        "creditHours": req.creditHours,
        "hoursCompleted": hoursCompleted,
        "options": req.options,
        "takenInPool": takenInPool
      });
    }
  }

  return pools;
}

function getCreditsCompleted(requirements, takenCourses, poolProgress) {
  let total = 0;
  for (const req of requirements) {
    if (req.type === "single" && takenCourses.has(req.course)) {
      total += COURSES[req.course]?.hours || 0;
    } else if (req.type === "choose") {
      const taken = req.options.filter(c => takenCourses.has(c));
      const capped = taken.slice(0, req.count);
      for (const courseId of capped) {
        total += COURSES[courseId]?.hours || 0;
      }
    }
  }
  for (const pool of poolProgress) {
    total += Math.min(pool.hoursCompleted, pool.creditHours);
  }

  return total;
}

function getMissingPrereqs(prereqs, takenCourses) {
  if (!prereqs || Object.keys(prereqs).length === 0) return [];

  if (prereqs.and) {
    let missing = [];
    for (const item of prereqs.and) {
      if (typeof item === "string") {
        if (!takenCourses.has(item)) missing.push(item);
      } else if (!isSatisfied(item, takenCourses)) {
        missing.push(...getMissingPrereqs(item, takenCourses));
      }
    }
    return missing;
  }

  if (prereqs.or) {
    const satisfied = prereqs.or.some(item =>
      typeof item === "string" ? takenCourses.has(item) : isSatisfied(item, takenCourses)
    );
    if (satisfied) return [];

    const options = prereqs.or.map(item =>
      typeof item === "string" ? item : getMissingPrereqs(item, takenCourses).join(" and ")
    );

    return [`(one of: ${options.join(", ")})`];
  }

  return [];
}

export function useCourseTracker(selectedMajor, selectedThreads = []) {
  const [takenCourses, setTakenCourses] = useState(() => {
    if (!selectedMajor) return new Set();
    const saved = localStorage.getItem(`takenCourses:${selectedMajor}`);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    if (!selectedMajor) {
      setTakenCourses(new Set());
      return;
    }
    const saved = localStorage.getItem(`takenCourses:${selectedMajor}`);
    setTakenCourses(saved ? new Set(JSON.parse(saved)) : new Set());
  }, [selectedMajor]);

  useEffect(() => {
    if (!selectedMajor) return;
    localStorage.setItem(`takenCourses:${selectedMajor}`, JSON.stringify([...takenCourses]));
  }, [takenCourses, selectedMajor]);

  const majorData = selectedMajor ? MAJORS[selectedMajor] : null;
  const baseRequirements = majorData ? majorData.requirements : [];
  const threadRequirements = selectedThreads
    .filter(Boolean)
    .flatMap(threadName => THREADS[selectedMajor]?.[threadName]?.requirements || []);

  const requirements = [...baseRequirements, ...threadRequirements];

  const majorCourses = flattenRequirementCourses(requirements);
  const relevantCourses = selectedMajor ? getRelevantCourses(majorCourses) : new Set();
  const mootCourses = selectedMajor ? getMootCourses(requirements, takenCourses) : new Set();
  const choiceGroupInfo = selectedMajor ? buildChoiceGroupInfo(requirements) : new Map();
  const poolProgress = selectedMajor ? getPoolProgress(requirements, takenCourses) : [];
  const availableCourses = [];
  const lockedCourses = [];

  for (const courseId of relevantCourses) {
    if (takenCourses.has(courseId) || mootCourses.has(courseId)) continue;

    const course = COURSES[courseId];
    if (!course) continue;

    if (isSatisfied(COURSES[courseId].prereqs, takenCourses)) {
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
        for (const id of next) {
          if (!isSatisfied(COURSES[id].prereqs, next)) {
            queue.push(id);
          }
        }
      }
    }

    setTakenCourses(next);
  };

  const resetProgress = () => {
    setTakenCourses(new Set());
  };

  const creditsCompleted = selectedMajor ? getCreditsCompleted(requirements, takenCourses, poolProgress) : 0;
  const threadTotalCredits = selectedThreads.filter(Boolean).reduce((sum, t) => sum + (THREADS[selectedMajor]?.[t]?.totalCredits || 0), 0);
  const totalCredits = selectedMajor ? majorData.totalCredits + threadTotalCredits : 0;

  const getMissingPrereqsFor = (courseId) => {
    const course = COURSES[courseId];
    if (!course) return [];
    return getMissingPrereqs(course.prereqs, takenCourses);
  };

  return {
    takenCourses, availableCourses, lockedCourses, choiceGroupInfo,
    poolProgress, creditsCompleted, totalCredits, addCourse, removeCourse,
    resetProgress, getMissingPrereqsFor
  };
}