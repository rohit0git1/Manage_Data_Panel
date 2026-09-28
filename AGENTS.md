# AGENTS.md

# BlackCube Solutions — Manage Data Panel
## AI Coding Agent Rules

You are the implementation agent for a time-limited MERN interview assignment.

The source of truth for product requirements is `PROJECT_SPEC.md`.
The source of truth for execution order is `IMPLEMENTATION_PLAN.md`.
This file contains the engineering rules that must be followed while working in the repository.

---

## 1. Mission

Build a production-like, fully functional Manage Data admin panel for the BlackCube Solutions interview assignment.

The evaluator cares primarily about a working end-to-end flow:

Excel/CSV Upload
→ validation and header mapping
→ preview
→ real backend import
→ persistent MongoDB storage
→ Manage Data table
→ search/filter/category/pagination
→ update/delete
→ correct counts
→ responsive UI
→ production deployment on Vercel.

Do not optimize for the largest feature count. Optimize for a stable complete flow.

---

## 2. Mandatory priority order

Always prioritize in this order:

1. Real database connectivity
2. Real backend APIs
3. Excel/CSV import flow
4. Manage Data table
5. Category tabs
6. Search and filters
7. Pagination
8. Update
9. Delete + confirmation
10. Loading/empty/error/success states
11. Responsive UI
12. Vercel production deployment
13. GitHub README and `.env.example`
14. Optional bonus features only after all mandatory items work

If time becomes constrained, cut polish and optional features before cutting core functionality.

---

## 3. Technology decisions

Use the following stack unless a concrete repository constraint makes it impossible:

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router where routing is needed
- Lucide React for icons if an icon library is needed

### Backend
- Node.js
- Express
- Mongoose

### Database
- MongoDB Atlas

### Excel/CSV
- `xlsx` for `.xlsx`, `.xls`, and CSV parsing

### Deployment
- One GitHub repository
- One Vercel deployment serving the frontend and API
- Production database: MongoDB Atlas

Prefer a single-repository architecture over unnecessary separate services.

---

## 4. Architecture rules

Preferred structure:

```text
/
├── src/                  # React frontend
├── server/
│   ├── app.js
│   ├── config/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── utils/
├── api/
│   └── index.js          # Vercel serverless entry
├── public/
├── PROJECT_SPEC.md
├── IMPLEMENTATION_PLAN.md
├── AGENTS.md
├── README.md
├── .env.example
├── .gitignore
├── package.json
└── vercel.json
```

Keep frontend and backend responsibilities separate.

Frontend:
- UI
- client-side file parsing
- user interaction
- optimistic UI only when safe
- API calls
- user-facing validation and messages

Backend:
- database access
- authoritative validation
- filtering/search/pagination
- summary counts
- update/delete
- error handling
- persistence

Database:
- source of truth

Never use browser localStorage/sessionStorage as the application database.

---

## 5. Single source of truth

Do not duplicate business logic unnecessarily.

For records:
- MongoDB is the source of truth.
- The frontend table is a view of API results.
- Summary counts come from the backend/database.
- Filters must affect the actual backend query.
- Refreshing the browser must preserve imported data.

For requirements:
- `PROJECT_SPEC.md` is the source of truth.
- If implementation conflicts with it, stop and resolve the conflict instead of silently changing requirements.

---

## 6. Product scope rules

Mandatory features are defined in `PROJECT_SPEC.md`.

Optional features must not delay mandatory features.

Do NOT add:
- complex authentication unless all required features are already complete
- large analytics dashboards
- audit logs
- export
- sophisticated role/permission systems
- unnecessary state-management frameworks
- unnecessary UI libraries
- unnecessary animations
- speculative business features

Do not create a feature because it “might be useful” unless it is required or clearly helps the required flow.

---

## 7. Coding style

Write code that is:
- readable
- modular
- small enough to understand
- consistently named
- reusable where repetition is real
- defensive around external input
- easy for a reviewer to follow

Avoid:
- giant components
- deeply nested conditional logic
- duplicated API logic
- duplicated validation logic without reason
- magic numbers/strings when a constant is clearer
- unused dependencies
- dead code
- commented-out old implementations
- generated noise files

Prefer early returns and clear function boundaries.

---

## 8. Data validation

Validate on the client for fast user feedback.

Validate again on the server because the server is authoritative.

Never trust:
- uploaded spreadsheet contents
- frontend-provided status values
- category values
- IDs
- pagination parameters
- search/filter input

Do not allow arbitrary MongoDB query operators to be passed from request query strings.

Sanitize/validate IDs before database operations.

Return useful HTTP status codes and JSON error messages.

---

## 9. Excel/CSV import rules

The upload flow must be:

```text
select/drop file
→ file type validation
→ parse spreadsheet
→ normalize headers
→ validate required fields
→ header mapping
→ row validation
→ preview
→ confirm
→ POST to backend
→ server validation
→ database insert
→ refresh Manage Data
```

The frontend may parse the spreadsheet for preview and mapping, but the backend must validate the final payload before writing to MongoDB.

Do not upload arbitrary file bytes to MongoDB.

Do not silently import rows that failed validation.

For invalid rows:
- show row numbers
- show the reason
- let the user correct/re-upload rather than silently changing data.

For missing optional values, use empty values/null according to the schema.
Do not invent fake user data.

---

## 10. Header mapping behavior

Header matching should be case-insensitive and whitespace-tolerant.

Support common aliases where safe, for example:

```text
name:
- name
- full name
- fullname

email:
- email
- email address
- e-mail

phone:
- phone
- phone number
- mobile
- mobile number

organisation:
- organisation
- organization
- company
- institute

type:
- type
- category
- user type

linkStatus:
- link status
- link_status
- linkstatus

downloadStatus:
- download status
- download_status
- downloadstatus

dateAdded:
- date added
- added on
- date_added
- created date
```

Do not guess a mapping when two columns could map to the same field. Show the mapping UI.

---

## 11. Status/category normalization

Use the exact UI labels in `PROJECT_SPEC.md`.

Normalize incoming values for comparison where sensible:
- trim whitespace
- case-insensitive matching
- consistent display labels

Do not invent unsupported categories during import.

Unexpected category/status values should be reported as validation errors unless the spec explicitly allows an “Others” fallback.

---

## 12. Backend/API rules

API responses should be predictable.

Preferred successful shape:

```json
{
  "success": true,
  "data": ...
}
```

Preferred error shape:

```json
{
  "success": false,
  "message": "Human-readable message",
  "errors": []
}
```

For paginated records, return enough metadata for the UI:

```json
{
  "success": true,
  "data": {
    "records": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "totalPages": 0
    }
  }
}
```

Keep route/controller/model responsibilities separate.

Use centralized error handling.

Do not log secrets, passwords, database connection strings, or uploaded personal data unnecessarily.

---

## 13. Database rules

Use MongoDB Atlas through Mongoose.

Cache/reuse the database connection so repeated Vercel serverless invocations do not create unnecessary connections.

Create indexes only where they support required behavior and are simple enough for the time limit.

Candidate indexes:
- `type`
- `linkStatus`
- `downloadStatus`
- `dateAdded`
- text/search-supporting fields if useful

Do not create an overcomplicated schema.

Every record must have a unique database ID.

Keep `dateAdded` stable during normal edits unless the product spec explicitly says otherwise.

---

## 14. Search/filter rules

Search:
- name
- email
- phone

Category:
- server-side `type` filtering

Status:
- link status
- download status

Date:
- sensible date ranges
- boundary behavior must be consistent and documented in code if needed

Pagination:
- page must never be below 1
- limit must be bounded
- total/totalPages must be calculated from the filtered result set

Reset Filters must return to the default state.

No-result responses are successful empty results, not errors.

---

## 15. Update/delete rules

Update:
- load existing record
- show existing values
- validate
- submit API request
- update database
- refresh affected record/counts
- show success feedback

Delete:
- require confirmation
- disable duplicate action while request is active
- call backend
- update table and counts
- if deletion fails, keep the row visible and show the error

Never visually remove a row permanently before a successful server response unless a safe rollback exists.

---

## 16. UX rules

Required states:
- initial loading
- table loading
- upload parsing
- importing
- saving
- deleting
- empty results
- validation errors
- API errors
- successful update/import/delete

Use clear messages.

Buttons that trigger requests should be disabled while that request is running.

Forms should preserve user input when validation fails.

Long table text must be truncated safely with a tooltip or equivalent.

The UI must remain usable on smaller screens.

Do not sacrifice functionality for decorative UI.

---

## 17. Security rules

Never commit:
- `.env`
- `.env.local`
- database passwords
- API keys
- private keys
- production connection strings
- secrets in source code

Use `.env.example` with variable names only.

Expected secret:

```text
MONGODB_URI=
```

The frontend should never receive the MongoDB URI.

Because frontend and API are served by the same Vercel deployment, prefer relative API requests such as `/api/...` to avoid unnecessary production URL configuration.

---

## 18. Dependency rules

Before installing a package:
1. Check whether the functionality can be implemented with existing dependencies.
2. Prefer small, established packages.
3. Do not install a large framework for a small feature.
4. After installing, run the relevant build/lint checks.

Do not replace the project's package manager without a clear reason.

---

## 19. Change management

Before a large change:
1. Inspect the existing implementation.
2. Identify what will be affected.
3. Make the smallest safe change.
4. Run verification.
5. Review the diff.

Do not rewrite working parts simply because another approach is prettier.

Do not modify unrelated files.

Keep the implementation incremental.

After each major phase, use git status/diff when git is available and keep the repository clean.

---

## 20. AI workflow rules

Every task must follow:

```text
Understand
→ Plan
→ Implement
→ Verify
→ Fix
→ Report
```

Do not say “done” just because code was generated.

For each completed task, report:
- files changed
- commands/checks run
- important results
- known issues
- what remains

Never hide a failed test/build.

If a check fails because of your change, attempt to fix it before moving on.

---

## 21. No unnecessary confirmation loops

Do not stop for approval for routine implementation choices that are already determined by the spec.

Ask for human input only when:
- a required credential/secret is missing
- a destructive external action needs confirmation
- two requirements genuinely conflict
- the repository contains an architectural constraint that blocks the planned approach
- deployment requires a value the human must provide

Otherwise make the smallest reasonable decision, document it, and continue.

---

## 22. Time-pressure rules

This is a 12-hour assignment.

When time is limited:
- finish end-to-end core functionality first
- reduce visual polish
- remove optional features
- avoid refactors that do not fix a requirement
- avoid infrastructure complexity
- avoid speculative abstractions

A simple working solution is better than an elegant incomplete solution.

---

## 23. Definition of complete

The project is not complete until the mandatory acceptance checklist in `PROJECT_SPEC.md` has been verified, including:

- import from Excel/CSV
- real MongoDB persistence
- summary counts
- category tabs
- search
- status/date filters
- reset filters
- pagination
- update persistence
- delete persistence
- loading/empty/error states
- responsive UI
- production Vercel API/database connectivity
- no committed secrets
- GitHub repository
- README
- `.env.example`

---

## 24. When requirements are missing

Do not invent business rules that materially change the assignment.

Use the following order:
1. BlackCube assignment wording
2. `PROJECT_SPEC.md` implementation decisions
3. Existing code conventions
4. Minimal reasonable engineering judgment

Document meaningful assumptions in `PROJECT_SPEC.md` or README.

---

## 25. First task behavior

When first entering the repository:
- read `AGENTS.md`
- read `PROJECT_SPEC.md`
- read `IMPLEMENTATION_PLAN.md`
- inspect the repository
- do not immediately start coding
- provide a concise implementation plan and identify blockers

After the plan is reviewed/approved, execute the plan phase by phase.
