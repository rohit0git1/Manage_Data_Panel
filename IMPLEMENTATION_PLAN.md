# IMPLEMENTATION_PLAN.md

# BlackCube Manage Data Panel — 12-Hour Execution Plan

## Objective

Finish and deploy a complete, working MERN application within approximately 12 hours.

The implementation strategy is **vertical and milestone-based**:
- build the real data path first
- verify each milestone
- do not polish an unconnected UI
- do not add optional features before mandatory features work

---

# 0. Working rules

Every milestone follows:

```text
Inspect
→ Plan
→ Implement
→ Run checks
→ Manually verify
→ Fix
→ Mark complete
```

A milestone is only complete when its definition of done is satisfied.

Do not move forward with known blocking failures.

Do not spend time making optional features beautiful while required features are broken.

---

# Phase 0 — Repository + requirement inspection
## Target: 20–30 minutes

### Tasks
- [ ] Read `AGENTS.md`
- [ ] Read `PROJECT_SPEC.md`
- [ ] Read this plan
- [ ] Inspect current repository
- [ ] Inspect existing package.json/config
- [ ] Determine whether the repo is empty or partially initialized
- [ ] Check Node/npm versions
- [ ] Identify any existing constraints
- [ ] Confirm architecture before coding

### AI deliverable
Provide:
- understanding of project
- architecture
- folder structure
- database schema
- API list
- implementation risks
- any blockers

### Do not code yet unless the repository is clearly empty and scaffolding is required.

### Definition of done
- architecture is clear
- no major blocker is unknown
- implementation order is agreed
- no unnecessary technology is introduced

---

# Phase 1 — Project scaffold + database foundation
## Target: ~60–90 minutes

### Tasks
- [ ] Initialize/clean React + Vite frontend
- [ ] Initialize Express backend structure
- [ ] Add MongoDB/Mongoose
- [ ] Create Record model
- [ ] Create MongoDB connection utility
- [ ] Add connection caching suitable for serverless use
- [ ] Add environment handling
- [ ] Add `.env.example`
- [ ] Add `.gitignore`
- [ ] Add `/api/health`
- [ ] Verify local app starts
- [ ] Verify database connects

### Record model
Minimum:

```text
name
email
phone
address
organisation
type
linkStatus
downloadStatus
dateAdded
createdAt
updatedAt
```

### Definition of done
- [ ] frontend starts
- [ ] backend starts
- [ ] MongoDB Atlas connection succeeds locally
- [ ] health endpoint succeeds
- [ ] no secrets are committed
- [ ] model can create/read a test record

---

# Phase 2 — Backend records API
## Target: ~90 minutes

### Tasks

Implement:

```http
GET    /api/records
GET    /api/records/:id
POST   /api/records/import
PUT    /api/records/:id
DELETE /api/records/:id
GET    /api/records/summary
```

### GET /records must support
- [ ] page
- [ ] limit
- [ ] type
- [ ] search
- [ ] linkStatus
- [ ] downloadStatus
- [ ] dateRange

### Backend behavior
- [ ] validation
- [ ] safe query construction
- [ ] pagination
- [ ] total count
- [ ] total pages
- [ ] correct HTTP status codes
- [ ] centralized error handling

### Summary
Return:
- [ ] all
- [ ] students
- [ ] teachers
- [ ] institutes

### Definition of done
Use a REST client/browser/Postman/curl or frontend test calls to verify:
- [ ] records can be listed
- [ ] filtering works
- [ ] search works
- [ ] pagination works
- [ ] summary works
- [ ] update works
- [ ] delete works
- [ ] invalid ID returns sensible error
- [ ] missing record returns 404

Do not build the final UI yet.

---

# Phase 3 — Excel/CSV import
## Target: ~90 minutes

### Tasks
- [ ] Upload/dropzone UI
- [ ] file extension/type validation
- [ ] parse .xlsx/.xls/.csv
- [ ] normalize headers
- [ ] automatic common-header mapping
- [ ] manual mapping UI for ambiguous/unmatched headers
- [ ] required field validation
- [ ] row-level validation
- [ ] invalid row report
- [ ] preview table
- [ ] import confirmation
- [ ] call POST /api/records/import
- [ ] backend re-validates
- [ ] save records in MongoDB
- [ ] import success message

### Required user experience

```text
Choose file
→ Parse
→ Map columns
→ Validate
→ Preview
→ Confirm Import
→ Import
→ Success
```

### Definition of done
- [ ] valid test CSV imports
- [ ] imported records appear in MongoDB
- [ ] malformed/missing required fields are rejected
- [ ] invalid file is rejected
- [ ] refresh after import retains records
- [ ] Manage Data API can retrieve imported records

---

# Phase 4 — Manage Data UI skeleton
## Target: ~75–90 minutes

### Tasks
- [ ] sidebar
- [ ] Manage Data route
- [ ] summary cards
- [ ] category tabs
- [ ] search input
- [ ] filters
- [ ] reset button
- [ ] table
- [ ] pagination
- [ ] badges
- [ ] responsive layout

### Important
Connect to real APIs immediately.

Do not populate the UI with hard-coded fake production data.

A small development fixture may be used for testing only.

### Definition of done
- [ ] Manage Data loads from API
- [ ] summary cards show database counts
- [ ] category tabs request correct backend filter
- [ ] search requests backend
- [ ] filters request backend
- [ ] pagination requests backend
- [ ] empty state works
- [ ] error state works
- [ ] loading state works

---

# Phase 5 — Update + Delete
## Target: ~60 minutes

### Update
- [ ] edit modal/form
- [ ] prefilled values
- [ ] validation
- [ ] PUT API call
- [ ] loading/disabled state
- [ ] success feedback
- [ ] refresh affected data

### Delete
- [ ] confirmation dialog
- [ ] DELETE API call
- [ ] loading/disabled state
- [ ] success feedback
- [ ] refresh table
- [ ] refresh counts
- [ ] handle last-record-on-page case

### Definition of done
- [ ] update changes database
- [ ] browser refresh confirms update persistence
- [ ] delete changes database
- [ ] browser refresh confirms delete persistence
- [ ] failure does not silently remove the row

---

# Phase 6 — UX quality + responsive polish
## Target: ~45–60 minutes

### Tasks
- [ ] desktop spacing/visual hierarchy
- [ ] mobile/sidebar adaptation
- [ ] table horizontal scroll/truncation
- [ ] accessible labels
- [ ] focus behavior
- [ ] disabled controls during requests
- [ ] consistent status/type badges
- [ ] toast/alert feedback
- [ ] clear empty state
- [ ] clear API error state
- [ ] upload progress state

### Definition of done
A reviewer can comfortably:
- navigate
- upload
- search
- filter
- edit
- delete
on desktop and a narrow viewport.

Do not spend more than the allocated time here.

---

# Phase 7 — Production deployment
## Target: ~45–60 minutes

### Tasks
- [ ] create/verify GitHub repository
- [ ] verify no secrets
- [ ] verify `.gitignore`
- [ ] add `.env.example`
- [ ] configure Vercel
- [ ] configure MongoDB Atlas production database
- [ ] add Vercel `MONGODB_URI`
- [ ] configure serverless API entry
- [ ] configure frontend/API routing
- [ ] deploy
- [ ] open production URL
- [ ] test health endpoint
- [ ] test real database operation from production

### Critical
Do not consider deployment complete just because the homepage opens.

The reviewer must be able to:
- upload
- import
- fetch
- filter
- update
- delete
against the production database.

### Definition of done
- [ ] public Vercel URL works
- [ ] API works in Vercel
- [ ] MongoDB Atlas works from Vercel
- [ ] no localhost API URLs remain in production
- [ ] refresh preserves data
- [ ] update/delete work in production

---

# Phase 8 — Final reviewer simulation
## Target: ~45–60 minutes

Use the production URL.

## Test 1 — Fresh open
- [ ] page loads
- [ ] no console-blocking errors
- [ ] Manage Data shows correct counts

## Test 2 — Upload
- [ ] upload a CSV
- [ ] mapping shown
- [ ] preview shown
- [ ] import succeeds

## Test 3 — Category
- [ ] All Data
- [ ] Students
- [ ] Teachers
- [ ] Mentors
- [ ] Job Seekers
- [ ] Institutes
- [ ] Others

## Test 4 — Search
Search by:
- [ ] name
- [ ] email
- [ ] phone

## Test 5 — Filters
- [ ] Link Status
- [ ] Download Status
- [ ] Date Added
- [ ] Reset Filters

## Test 6 — Pagination
- [ ] enough records
- [ ] next page
- [ ] previous page
- [ ] correct S.N.

## Test 7 — Update
- [ ] edit
- [ ] save
- [ ] verify table
- [ ] refresh browser
- [ ] verify persisted data

## Test 8 — Delete
- [ ] confirm
- [ ] delete
- [ ] count changes
- [ ] refresh
- [ ] record remains deleted

## Test 9 — Empty/error states
- [ ] impossible search produces empty state
- [ ] API failure produces useful error
- [ ] request buttons cannot be spammed

## Test 10 — Security/repo
- [ ] no `.env`
- [ ] no DB URI in source
- [ ] `.env.example` exists
- [ ] README exists

---

# Phase 9 — Submission preparation
## Target: ~20–30 minutes

Prepare the email response:

```text
Candidate Name: Rohit Rajak

Live Vercel URL: <URL>

GitHub Repository URL: <URL>

Database Used: MongoDB Atlas

Completed Features:
- Excel/CSV import with validation, mapping and preview
- Real MongoDB-backed Manage Data panel
- Summary counts
- Category filtering
- Search and status/date filters
- Pagination
- Update and Delete
- Loading/empty/error states
- Responsive UI
- Production Vercel deployment

Known Limitations / Notes:
- <truthful notes only>
```

Do not claim a feature is complete if it was not tested.

---

# Critical path

If behind schedule, focus only on:

```text
MongoDB
↓
API
↓
Excel import
↓
Manage Data
↓
Search/filter/category
↓
Pagination
↓
Update
↓
Delete
↓
Deployment
↓
Testing
```

Cut first:
- animations
- optional pages
- bulk actions
- export
- audit logs
- authentication
- advanced tests
- decorative dashboard content

---

# Stop rules

Stop adding new features when:
- mandatory upload works
- mandatory table works
- CRUD works
- filters/search work
- deployment works

Use the remaining time for:
- production bugs
- mobile bugs
- error handling
- reviewer test flow

---

# Expected final repository

```text
/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   └── ...
│
├── server/
│   ├── app.js
│   ├── config/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── utils/
│
├── api/
│   └── index.js
│
├── public/
├── AGENTS.md
├── PROJECT_SPEC.md
├── IMPLEMENTATION_PLAN.md
├── README.md
├── .env.example
├── .gitignore
├── package.json
└── vercel.json
```

---

# Definition of final completion

All of the following must be true:

```text
[ ] local build passes
[ ] production build/deployment passes
[ ] MongoDB Atlas connected
[ ] Excel/CSV import works
[ ] imported data persists
[ ] Manage Data loads real data
[ ] summary counts are dynamic
[ ] category tabs work
[ ] search works
[ ] filters work
[ ] reset works
[ ] pagination works
[ ] update persists
[ ] delete persists
[ ] loading/empty/error states work
[ ] responsive layout works
[ ] GitHub is clean
[ ] README exists
[ ] .env.example exists
[ ] no secrets committed
[ ] Vercel reviewer flow tested end-to-end
```
