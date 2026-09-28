# PROJECT_SPEC.md

# BlackCube Solutions — Manage Data Panel
## Product + Technical Specification

**Assignment:** MERN-STACK INTERVIEW TASK  
**Company:** BlackCube Solutions LLC  
**Required delivery:** 29-09-2026 before 05:00 PM  
**Primary goal:** Build a functional Manage Data admin panel whose records originate from Excel/CSV upload and are stored in a real persistent database.

---

# 1. Product in simple terms

This application is an admin panel for managing people/data records.

The administrator:
1. uploads an Excel/CSV file
2. the application reads and validates it
3. maps spreadsheet columns to application fields
4. previews the records
5. confirms the import
6. the backend stores the records in MongoDB
7. the Manage Data page loads those records from MongoDB
8. the administrator can search, filter, edit, and delete records

MongoDB is the source of truth.

Refreshing the browser must never erase imported records.

---

# 2. Official assignment requirements

The BlackCube assignment requires:

- fixed left sidebar
- Dashboard
- Manage Data
- Upload Excel
- Social & Ads
- active Manage Data navigation
- four dynamic summary cards
- category tabs
- search
- Link Status filter
- Download Status filter
- Date Added filter
- Reset Filters
- real backend filtering
- data table
- selection checkboxes
- pagination
- Update
- Delete with confirmation
- loading/empty/error states
- real backend APIs
- real persistent database
- server-side validation
- production Vercel deployment
- GitHub repository
- README
- `.env.example`
- no secrets in GitHub

The assignment explicitly states that static/mock data/local storage is insufficient.

---

# 3. Core user flow

## Flow A — Import data

```text
Upload Excel
↓
Choose or drag/drop .xlsx/.xls/.csv
↓
Validate file type
↓
Parse spreadsheet
↓
Normalize headers
↓
Map spreadsheet headers to application fields
↓
Validate required fields and row values
↓
Show import preview
↓
Show invalid rows/errors if any
↓
Administrator confirms
↓
POST validated records to backend
↓
Backend validates again
↓
MongoDB insert
↓
Import success
↓
Navigate/refresh Manage Data
↓
Imported records are visible
```

## Flow B — Manage data

```text
Manage Data
↓
Fetch records from backend
↓
Show summary counts
↓
Show category tabs
↓
Search/filter
↓
Backend returns filtered/paginated records
↓
Render table
```

## Flow C — Update

```text
Click Update
↓
Open edit modal/page
↓
Pre-filled existing values
↓
Validate
↓
PUT/PATCH backend
↓
MongoDB update
↓
Refresh record/counts
↓
Show success message
```

## Flow D — Delete

```text
Click Delete
↓
Confirm deletion
↓
DELETE backend
↓
MongoDB delete
↓
Refresh table/counts
↓
Show success message
```

---

# 4. Pages

## 4.1 Manage Data
This is the main evaluated page.

Contains:
- page header
- summary cards
- category tabs
- search/filter controls
- data table
- pagination
- update/delete actions

## 4.2 Upload Excel
Contains:
- drag/drop zone
- file picker
- accepted file types
- validation feedback
- header mapping UI
- preview table
- import button
- import progress/loading
- success/error result

## 4.3 Dashboard
The sidebar must contain it.

For the time-limited implementation, keep it minimal unless the repository or assignment provides more requirements. It should not consume time needed by Manage Data and Upload Excel.

## 4.4 Social & Ads
The sidebar must contain it.

Do not build complex business functionality here unless explicitly required elsewhere. A simple placeholder page is acceptable for this assignment so long as the required Manage Data workflow is complete.

---

# 5. Sidebar/navigation

Required menu:
- Dashboard
- Manage Data
- Upload Excel
- Social & Ads

Manage Data is visually active when on the Manage Data route.

The sidebar should be:
- fixed/consistent on desktop
- usable on smaller screens
- not block the main content

---

# 6. Summary cards

Required cards:

| Card | Meaning |
|---|---|
| All Data | total number of records |
| Students | records where `type = Students` |
| Teachers | records where `type = Teachers` |
| Institutes | records where `type = Institutes` |

Rules:
- values come from backend/database
- no hard-coded numbers
- update after import
- update after update/delete
- should represent current database state

Recommended API:
`GET /api/records/summary`

Recommended response:

```json
{
  "success": true,
  "data": {
    "all": 0,
    "students": 0,
    "teachers": 0,
    "institutes": 0
  }
}
```

---

# 7. Category tabs

Required labels:

```text
All Data
Students
Teachers
Mentors
Job Seekers
Institutes
Others
```

Behavior:
- All Data → no type filter
- other tabs → backend type filter
- active tab visibly highlighted
- tab changes preserve current app state where practical
- data must come from API/database

---

# 8. Search

Search fields:
- name
- email
- phone number

Recommended query parameter:
`search=`

Backend behavior:
- one search term may match any of those three fields
- case-insensitive
- partial matching is acceptable
- return zero records without treating it as an error

Important:
Do not download the entire database and filter a hard-coded frontend array for the main feature.

---

# 9. Filters

## 9.1 Link Status

At minimum:

```text
All Status
Pending
Sent
```

## 9.2 Download Status

At minimum:

```text
All Status
Pending
Downloaded
Completed
```

## 9.3 Date Added

Required:
- All Time
- sensible date ranges

Recommended ranges for implementation:

```text
All Time
Today
Last 7 Days
Last 30 Days
Last 90 Days
```

Use server/database date filtering.

## 9.4 Reset Filters

Reset:
- search
- category
- link status
- download status
- date range
- pagination page → 1

---

# 10. Data table

Required columns:

```text
Selection checkbox
S.N.
Name
Email
Phone No.
Address
Organisation
Type
Link Status
Download Status
Added On
Action
```

Rules:
- S.N. is correct for the current result/page
- type is a readable badge
- Link Status is a badge
- Download Status is a badge
- long text is truncated safely
- checkboxes work visually
- pagination is present for larger datasets
- loading state exists
- empty state exists
- error state exists

Bulk actions are optional and should not block the mandatory implementation.

---

# 11. Record data model

Minimum fields:

```text
_id / unique record ID
name
email
phone
address
organisation
type
linkStatus
downloadStatus
dateAdded
```

Recommended additional fields:

```text
createdAt
updatedAt
```

### Field intent

| Field | Description |
|---|---|
| `name` | person's/display record name |
| `email` | email address |
| `phone` | phone/mobile number |
| `address` | address text |
| `organisation` | company/school/institute/etc. |
| `type` | supported category |
| `linkStatus` | link-related state |
| `downloadStatus` | download-related state |
| `dateAdded` | imported/added date |
| `_id` | MongoDB unique ID |

Do not overcomplicate the schema.

---

# 12. Category values

Canonical UI/database values:

```text
Students
Teachers
Mentors
Job Seekers
Institutes
Others
```

All Data is a filter state, not necessarily a stored type.

Incoming spreadsheet values should be normalized where safe, for example:
- `Student` → `Students`
- `Teacher` → `Teachers`
- `Mentor` → `Mentors`
- `Job Seeker` / `Job Seekers` → `Job Seekers`
- `Institute` / `Institutes` → `Institutes`
- unknown valid business category → `Others` only if explicitly supported by the chosen implementation

Do not silently turn a missing/invalid category into a valid value.

---

# 13. Status values

Canonical Link Status values:

```text
Pending
Sent
```

Canonical Download Status values:

```text
Pending
Downloaded
Completed
```

Trim whitespace and normalize case when importing.

Do not accept arbitrary values into the database without validation.

---

# 14. Required import fields

For a practical implementation, treat these as required:

```text
Name
Email
Phone
Type
```

Address, Organisation, Link Status, Download Status, and Date Added may be optional in the spreadsheet.

Defaults when optional values are missing:

```text
address          → empty string
organisation     → empty string
linkStatus       → Pending
downloadStatus   → Pending
dateAdded        → current server date/time
```

Important:
These defaults are implementation decisions to make the import flow robust. They are not additional business requirements from BlackCube.

---

# 15. Excel/CSV support

Accepted extensions:

```text
.xlsx
.xls
.csv
```

The frontend may parse the spreadsheet using `xlsx`.

### Header normalization

Normalize:
- lowercase for comparison
- trim surrounding spaces
- collapse repeated spaces where useful

Common aliases:

| Application field | Possible spreadsheet headers |
|---|---|
| name | Name, Full Name, FullName |
| email | Email, Email Address, E-mail |
| phone | Phone, Phone Number, Mobile, Mobile Number |
| address | Address |
| organisation | Organisation, Organization, Company, Institute |
| type | Type, Category, User Type |
| linkStatus | Link Status, Link_Status, LinkStatus |
| downloadStatus | Download Status, Download_Status, DownloadStatus |
| dateAdded | Date Added, Added On, Date_Added, Created Date |

If the mapping is ambiguous, require the user to choose in the mapping UI.

---

# 16. Import validation

Reject:
- unsupported file type
- unreadable/corrupt spreadsheet
- missing required mapped fields
- completely empty rows
- required field values that are empty
- invalid email
- invalid/empty phone where phone is required
- unsupported category
- unsupported status

For validation errors:
- show row number
- show field
- show reason

Example:

```text
Row 7:
Email is invalid

Row 12:
Type is missing
```

Do not silently discard invalid rows.

---

# 17. Import preview

Before final import show:
- file name
- number of rows
- mapped fields
- valid row count
- invalid row count
- preview table

Import button should remain disabled when required mapping/validation is not complete.

On import:
- disable duplicate submission
- show loading state
- show success/error feedback

---

# 18. Import API

Recommended endpoint:

```http
POST /api/records/import
```

Body:

```json
{
  "records": [
    {
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "phone": "9876543210",
      "address": "Indore",
      "organisation": "ABC College",
      "type": "Students",
      "linkStatus": "Pending",
      "downloadStatus": "Pending",
      "dateAdded": "2026-09-28T10:00:00.000Z"
    }
  ]
}
```

Backend must validate every record again before insertion.

---

# 19. Record APIs

Minimum API set:

```http
GET    /api/records
GET    /api/records/:id
POST   /api/records/import
PUT    /api/records/:id
DELETE /api/records/:id
GET    /api/records/summary
```

Optional:
```http
GET /api/health
```

---

# 20. GET records

Recommended query:

```text
GET /api/records
  ?page=1
  &limit=10
  &type=Students
  &search=rahul
  &linkStatus=Pending
  &downloadStatus=Pending
  &dateRange=7days
```

Rules:
- all filters are optional
- only valid enum values are accepted
- page defaults to 1
- limit defaults to 10
- cap limit to a sensible maximum such as 100
- return pagination metadata
- sort newest `dateAdded` first unless a better simple default is needed

Suggested response:

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

---

# 21. Get one record

```http
GET /api/records/:id
```

Use it for editing/details if needed.

Return 404 when the record does not exist.

---

# 22. Update

```http
PUT /api/records/:id
```

Rules:
- validate required fields
- validate type/status enums
- validate email/phone
- update MongoDB
- preserve `_id`
- preserve `dateAdded` by default
- update `updatedAt`
- return updated record

---

# 23. Delete

```http
DELETE /api/records/:id
```

Rules:
- validate ID
- 404 if not found
- delete from MongoDB
- return success response
- UI refreshes current page/counts
- handle the case where the deleted record was the last item on a page

---

# 24. Summary calculations

Summary counts must use the database.

Minimum counts:
- total
- Students
- Teachers
- Institutes

Never derive these from a partial current page.

---

# 25. Pagination behavior

Default:
```text
page = 1
limit = 10
```

The S.N. formula should effectively be:

```text
(page - 1) * limit + rowIndex + 1
```

When filters change:
- reset to page 1

When deleting the only last row of a page:
- move to the previous valid page when necessary

---

# 26. Error behavior

## Frontend
Show friendly messages for:
- file error
- validation error
- import error
- fetch error
- update error
- delete error
- network error

## Backend
Use clear HTTP status codes:
- `200` success read/update
- `201` created/imported when appropriate
- `400` validation/bad request
- `404` record not found
- `500` unexpected server/database error

Do not expose stack traces to the end user.

---

# 27. Loading/empty/success states

Required examples:

### Loading
```text
Loading records...
```
or a skeleton/spinner.

### Empty
```text
No records found
Try changing your search or filters.
```

### Upload
```text
Reading file...
Validating...
Preparing preview...
Importing...
```

### Success
```text
Record updated successfully.
Record deleted successfully.
120 records imported successfully.
```

### Error
```text
Unable to load records. Please try again.
```

---

# 28. Responsive requirements

Desktop:
- fixed/sidebar navigation
- wide table

Mobile/smaller screens:
- sidebar collapses or adapts
- table remains usable through horizontal scrolling or responsive layout
- filters wrap/stack
- modals/forms fit viewport
- buttons remain tappable
- no critical content is cut off

Do not spend excessive time on pixel-perfect design.

---

# 29. Visual direction

Create a professional admin-dashboard appearance:
- clean spacing
- clear hierarchy
- readable typography
- subtle borders/shadows
- consistent badges
- obvious active tab
- clear buttons
- restrained animation

Functionality is more important than decoration.

---

# 30. Deployment architecture

Preferred:

```text
Browser
  ↓
Vercel
  ├── React frontend
  └── Express API/serverless entry
          ↓
       MongoDB Atlas
```

Prefer frontend requests such as:

```text
/api/records
/api/records/summary
/api/records/import
```

rather than hard-coding a production API host.

Local development can use Vite proxying to the local Express server if necessary.

---

# 31. Environment variables

Expected:

```text
MONGODB_URI=
```

`.env.example` contains names only:

```text
MONGODB_URI=
```

Do not commit real values.

MongoDB URI must exist in:
- local `.env.local` or `.env`
- Vercel production environment variables

The frontend must never receive `MONGODB_URI`.

---

# 32. GitHub requirements

Repository must contain:
- complete source code
- README
- `.env.example`
- clean structure
- no passwords/API keys/database credentials
- no unnecessary build artifacts

README should include:
- overview
- features
- tech stack
- local setup
- environment variables
- database setup
- Excel import behavior
- API overview
- deployment
- known limitations

---

# 33. Acceptance checklist

## Setup
- [ ] App starts locally
- [ ] Frontend builds successfully
- [ ] Backend/API starts successfully
- [ ] MongoDB connects

## Upload
- [ ] .xlsx accepted
- [ ] .xls accepted
- [ ] .csv accepted
- [ ] invalid file rejected
- [ ] spreadsheet parsed
- [ ] header mapping shown
- [ ] required fields validated
- [ ] row errors shown
- [ ] preview shown
- [ ] import works
- [ ] data persists in MongoDB

## Manage Data
- [ ] records loaded from API
- [ ] All Data tab works
- [ ] Students works
- [ ] Teachers works
- [ ] Mentors works
- [ ] Job Seekers works
- [ ] Institutes works
- [ ] Others works
- [ ] summary counts work
- [ ] search by name works
- [ ] search by email works
- [ ] search by phone works
- [ ] Link Status works
- [ ] Download Status works
- [ ] Date Added works
- [ ] Reset Filters works
- [ ] pagination works
- [ ] S.N. is correct
- [ ] badges work
- [ ] loading state works
- [ ] empty state works
- [ ] error state works

## Update/Delete
- [ ] edit opens with existing values
- [ ] validation works
- [ ] update persists
- [ ] refresh confirms update persistence
- [ ] delete confirmation works
- [ ] delete persists
- [ ] refresh confirms deletion
- [ ] counts refresh
- [ ] failed delete does not silently remove UI row

## Production
- [ ] GitHub repo accessible
- [ ] Vercel URL accessible
- [ ] Vercel API works
- [ ] production MongoDB works
- [ ] refresh does not lose data
- [ ] no secrets committed

---

# 34. Manual end-to-end test dataset

Create/use a small test CSV locally for verification, for example:

```csv
Name,Email,Phone,Address,Organisation,Type,Link Status,Download Status,Date Added
Rahul Sharma,rahul@example.com,9876543210,Indore,ABC College,Students,Pending,Pending,2026-09-28
Amit Verma,amit@example.com,9123456780,Bhopal,XYZ School,Teachers,Sent,Completed,2026-09-27
Neha Patel,neha@example.com,9988776655,Indore,PQR Institute,Mentors,Sent,Downloaded,2026-09-26
Pooja Mehta,pooja@example.com,9000000000,Indore,Startup Hub,Job Seekers,Pending,Pending,2026-09-25
```

This is only a development test fixture. Do not rely on hard-coded fixture data in the deployed application's main functionality.

---

# 35. Implementation assumptions

These are practical choices for completing the assignment quickly; they are not claims that BlackCube separately required them:

1. React parses the spreadsheet for preview/mapping.
2. Backend validates the final import payload.
3. MongoDB Atlas is the production database.
4. Frontend and API share the same Vercel deployment.
5. API calls use `/api/...`.
6. Date Added defaults to the current server time when not supplied.
7. Link Status defaults to Pending.
8. Download Status defaults to Pending.
9. No email uniqueness constraint is required.
10. Bulk actions are optional and not part of the critical path.
11. Authentication is optional and not part of the critical path.
12. Dashboard/Social & Ads can remain minimal so the required Manage Data workflow receives the development time.

---

# 36. Non-goals

Do not build these unless all mandatory features are complete:

- advanced authentication/authorization
- audit history
- bulk update/delete
- CSV/Excel export
- complex charts
- ad-management logic
- elaborate dashboard analytics
- unit/integration test suite
- multi-tenant architecture
- advanced search engine infrastructure

---

# 37. Reviewer perspective

Assume the reviewer will:
1. open the Vercel URL
2. inspect the UI
3. upload a spreadsheet
4. verify preview/mapping
5. import records
6. switch category tabs
7. search
8. use filters
9. paginate
10. edit a record
11. refresh
12. delete a record
13. refresh
14. inspect whether counts changed correctly
15. test error/empty/loading behavior
16. verify the production API/database is real

Build for this flow first.
