import { useEffect, useState } from 'react';
import { useCourseTracker } from './useCourseTracker';
import { CourseColumn } from './components/CourseColumn';
import { PoolCard } from './components/PoolCard';
import { ProgressBar } from './components/ProgressBar'
import { GithubLink } from './components/GithubLink';
import COURSES from './courses.json'
import MAJORS from './majors.json';
import THREADS from './threads.json';
import './App.css';

function encodeShareData(major, threads, taken) {
  const data = {major: major, threads: threads, taken: [...taken]};
  return btoa(encodeURIComponent(JSON.stringify(data)));
}

function decodeShareData(encodedData) {
  try {
    const json = decodeURIComponent(atob(encodedData));
    return JSON.parse(json)
  } catch {
    return null;
  }
}

function filterCourses(courseIds, searchTerm) {
  if (!searchTerm.trim()) return courseIds;
  const lower = searchTerm.toLowerCase();

  return courseIds.filter(courseId => {
    const course = COURSES[courseId];
    const idMatch = courseId.toLowerCase().includes(lower);
    const titleMatch = course?.name?.toLowerCase().includes(lower);
    return idMatch || titleMatch;
  });
}

function getAvailableThreadsForSlot(threadSlots, selectedThreads, slotIndex) {
  const chosenElsewhere = selectedThreads.filter((t, i) => i !== slotIndex && t);

  return threadSlots.options.filter(thread => {
    return !chosenElsewhere.includes(thread);
  });
}

function App() {
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedThreads, setSelectedThreads] = useState([]);
  const [takenSearch, setTakenSearch] = useState("");
  const [availableSearch, setAvailableSearch] = useState("");
  const [lockedSearch, setLockedSearch] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encodedData = params.get("data");
    if (!encodedData) return;

    const parsed = decodeShareData(encodedData);
    if (!parsed || !MAJORS[parsed.major]) return;

    setSelectedMajor(parsed.major);
    setSelectedThreads(parsed.threads);
    localStorage.setItem(`takenCourses:${parsed.major}`, JSON.stringify(parsed.taken || []));
    
    window.history.replaceState({}, "", window.location.pathname);
  }, []);

  function copyShareLink() {
    const encoded = encodeShareData(selectedMajor, selectedThreads, takenCourses);
    const url = `${window.location.origin}${window.location.pathname}?data=${encoded}`;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  const majorData = selectedMajor ? MAJORS[selectedMajor] : null;
  const threadSlots = majorData?.threadSlots;

  const {
    takenCourses,
    availableCourses,
    lockedCourses,
    choiceGroupInfo,
    poolProgress,
    creditsCompleted,
    totalCredits,
    addCourse,
    removeCourse,
    resetProgress,
    getMissingPrereqsFor
  } = useCourseTracker(selectedMajor, selectedThreads);

  if (!selectedMajor) {
    return (
      <>
        <div className="majors">
          <h1>prereqd</h1>
          <h1>Select your major</h1>
          <input
            list="majors"
            placeholder="Search for your major..."
            onChange={(e) => {
              if (MAJORS[e.target.value]) {
                setSelectedMajor(e.target.value);
                const slots = MAJORS[e.target.value].threadSlots;
                setSelectedThreads(slots ? Array(slots.count).fill(null) : []);
              }
            }}
          />
          <datalist id="majors">
            {Object.keys(MAJORS).map(major => (
              <option key={major} value={major}/>
            ))}
          </datalist>
        </div>
        <GithubLink />
      </>
    );
  }
  
  const allThreadsPicked = selectedThreads.every(Boolean);

  return (
    <>
      <div>
        <h1>prereqd</h1>
        <h1>{selectedMajor}</h1>
        {threadSlots && (
          <div className="thread-selection">
            {selectedThreads.map((thread, i) => (
              <select
                key={i}
                value={thread || ""}
                onChange={(e) => {
                  const next = [...selectedThreads];
                  next[i] = e.target.value || null;
                  setSelectedThreads(next);
                }}
              >
                <option value="">Select thread {i + 1}...</option>
                {getAvailableThreadsForSlot(threadSlots, selectedThreads, i).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            ))}
          </div>
        )}
        <ProgressBar completed={creditsCompleted} total={totalCredits}/>
        <div className="button-row">
          <button className="reset-button" onClick={resetProgress}>Reset Progress</button>
          <button
            className="revert-major"
            onClick={() => {
              setSelectedMajor(null);
              setSelectedThreads([]);
            }}
          >
            Change Major
          </button>
          <button onClick={copyShareLink}>{linkCopied ? "Link Copied!" : "Copy Share Link"}</button>
        </div>

        {allThreadsPicked && (
          <>
            <h2>Degree Pool Requirements</h2>
            <div className="pool-section">
              {poolProgress.map(pool => {
                return <PoolCard key={pool.name} pool={pool} />
              })}
            </div>
            <div className="lists">
              <CourseColumn
                title="Taken"
                count={takenCourses.size}
                courses={filterCourses([...takenCourses], takenSearch)}
                status="taken"
                onCardClick={removeCourse}
                searchTerm={takenSearch}
                onSearchChange={setTakenSearch}
              />
              <CourseColumn
                title="Available"
                count={availableCourses.length}
                courses={filterCourses(availableCourses, availableSearch)}
                status="available"
                choiceGroupInfo={choiceGroupInfo}
                onCardClick={addCourse}
                searchTerm={availableSearch}
                onSearchChange={setAvailableSearch}
              />
              <CourseColumn
                title="Locked"
                count={lockedCourses.length}
                courses={filterCourses(lockedCourses, lockedSearch)}
                status="locked"
                choiceGroupInfo={choiceGroupInfo}
                getMissingPrereqsFor={getMissingPrereqsFor}
                searchTerm={lockedSearch}
                onSearchChange={setLockedSearch}
              />
            </div>
          </>
        )}
      </div>
      <GithubLink />
    </>
  );
}

export default App;