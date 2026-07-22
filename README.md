# prereqd

**[Live app →](https://prereqd.vercel.app)**

A visual course-planning tool for Georgia Tech students. Pick your major
(and threads, if applicable), and see which courses you can
take right now, which are locked behind prerequisites, and how close you
are to finishing your degree requirements — all tracked automatically as
you mark courses taken.

**⚠️ Unofficial tool.** This is a personal project, not affiliated with
Georgia Tech. Requirements are transcribed from the catalog and may
contain errors or simplifications — always confirm with your academic
advisor or DegreeWorks before making real decisions.

## What it does

- Select a major and see three columns: **Taken**, **Available**, and
  **Locked**
- Click a course to mark it taken — anything that only needed that course
  as a prerequisite automatically unlocks
- Un-mark a course and anything that depended on it locks again
  (cascading, not just a single-level check)
- Majors with threads (Computational Media, Computer
  Science, Electrical Engineering, etc.) let you pick your thread(s) and
  merge in their specific requirements on top of the shared core
- A live progress bar tracks completed credit hours against the degree
  total, including partial-credit "pool" requirements (e.g. Lab Science,
  elective buckets)
- Missing prerequisites are shown per locked course when you click the
  relevant course card, including nested AND/OR logic (e.g. "MATH 1552 and (PHYS 2211 or PHYS 2231)")
- Share your progress via a link — no account, no backend, no database

## How requirements are modeled

Real degree requirements don't fit a flat list. This app models three
requirement shapes:

- **`single`** — one specific required course
- **`choose`** — pick N of a list of options (e.g. "1 of 3 wellness
  courses")
- **`pool`** — accumulate a target number of credit hours from a list of
  options (e.g. "9 hours of Lab Science")

Prerequisites themselves are stored as nested AND/OR trees, since real
prereq chains aren't just flat lists — a course can require "A and (B or
C)."

## Why a scraper

Georgia Tech doesn't publish a course/prerequisite API, so there's no
structured source of truth to build this on top of. I wrote a separate
scraper to pull course and prerequisite data from the public catalog
pages into the JSON format this app uses.

👉 https://github.com/ooblytoosh/prereqd-scraper

## Tech stack

- React (hooks, no external state management library)
- Vite
- Plain CSS
- Data lives in static JSON files (`courses.json`, `majors.json`,
  `threads.json`) — no backend

## Known limitations

- Some requirement categories (Free Electives, "Any HUM," broad
  multi-department elective rules) aren't enumerable from the public
  catalog and are intentionally left out rather than guessed at
- A handful of requirements involve constraints this data model can't
  fully express (e.g. "must be the same language concentration," "no
  course may satisfy two categories at once")
- Several majors have multiple named options or variants beyond the
  thread system (e.g. "Standard Option" vs. other tracks, business/
  management concentrations); only one variant is modeled per major
  unless otherwise noted
- Course data covers a subset of majors; contributions/corrections
  welcome
- OSCAR (The Georgia Tech course database) may be out of date for some
  majors/courses.

## Running locally

```bash
npm install
npm run dev
```

Built with [Vite](https://vitejs.dev/).

## Contributing

Found a wrong prerequisite or an outdated requirement? Open an issue or
a PR
