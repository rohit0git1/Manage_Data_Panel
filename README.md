# Manage Data Panel — BlackCube Solutions

MERN interview assignment: admin panel where records originate from Excel/CSV upload and persist in MongoDB. MongoDB is the source of truth — refresh never loses data.

## Project Overview

Administrators upload `.xlsx` / `.xls` / `.csv`, the browser parses and maps headers, validates rows, previews, then `POST /api/records/import` stores validated records in MongoDB Atlas. The **Manage Data** page reads from `GET /api/records` and `GET /api/records/summary` with server-side search, filters, category tabs, pagination, and per-row Update/Delete via `PUT`/`DELETE /api/records/:id`.

## Features (Mandatory — Implemented)

- Excel/CSV import: drag/drop, extension check (`.xlsx/.xls/.csv`), `xlsx` parse (ArrayBuffer → first sheet → `sheet_to_json` header:1), header normalization (trim/lowercase/underscore→space), alias mapping (Name/Full Name, Email/Email Address, Phone/Mobile, Organisation/Company, Type/Category, linkStatus, downloadStatus, dateAdded), manual mapping when ambiguous, row validation, invalid-row reporting (row/field/reason), preview (file name/rows/valid/invalid), all-or-nothing `POST /api/records/import`, success/failure feedback, reset
- Real MongoDB Atlas persistence (no `localStorage`)
- Summary cards (All Data, Students, Teachers, Institutes) from `GET /api/records/summary`
- Category tabs (All Data, Students, Teachers, Mentors, Job Seekers, Institutes, Others) → `?type=`
- Search (name, email, phone) → `?search=` (case-insensitive, escaped regex, debounce 300ms)
- Filters: Link Status (All/Pending/Sent), Download Status (All/Pending/Downloaded/Completed), Date Added (All/Today/7/30/90 days) → `?linkStatus=&downloadStatus=&dateRange=`
- Reset Filters (clears search/category/status/date/page)
- Data table (checkbox, S.N. `(page-1)*limit+idx+1`, Name, Email, Phone, Address, Organisation, Type/Link/Download badges, Added On, Action) with truncation + tooltip, horizontal scroll, checkboxes visual-only
- Pagination (`page/limit/total/totalPages`, Previous/Next disabled, page numbers, empty hidden, page resets to 1 on filter change, last-row-on-page moves to previous page after delete)
- Update: modal prefilled, client validation, `PUT /api/records/:id`, preserves `dateAdded`, refreshes table+summary, success/error toast, disabled while saving
- Delete: confirmation (`Delete this record? {name}`), `DELETE /api/records/:id`, disables while deleting, refreshes table+summary, pagination edge handled, keeps row on failure
- Loading/empty/error/success states for table, summary, upload, import, save, delete
- Responsive: fixed sidebar (drawer on ≤640px), filters wrap, table scrolls, modals fit viewport
- Production-ready Vercel config (single repo, `api/index.js` serverless, `vercel.json` routes `/api/*` → API, `/*` → SPA, relative `/api` calls, `MONGODB_URI` server-only)

Placeholders (intentionally minimal): Dashboard, Social & Ads.

## Tech Stack

- **Frontend:** React 19, Vite 6, Tailwind CSS 3, Axios 1.7, React Router 7, `xlsx` 0.18.5
- **Backend:** Node 22, Express 4, Mongoose 8
- **DB:** MongoDB Atlas (via `MONGODB_URI`)
- **Deploy:** Vercel (frontend + API same deployment, `dist` + `api/index.js`)

## Local Setup

```bash
git clone <repo>
npm install

cp .env.example .env
# edit .env: MONGODB_URI=mongodb+srv://user:pass@cluster0.x.mongodb.net/Manage_Data_Panel
# optional for local DNS issues: DNS_SERVERS=1.1.1.1,8.8.8.8

# Terminal 1 — backend (http://localhost:5000)
npm run dev:server

# Terminal 2 — frontend (http://localhost:5173, proxies /api → :5000)
npm run dev

# Health: http://localhost:5000/api/health  → { success:true, data:{status:"ok", db:"connected"} }
# Build:  npm run build   → dist/
```

## Environment Variables

`.env.example`:

```
MONGODB_URI=
PORT=5000
DNS_SERVERS=1.1.1.1,8.8.8.8  # optional, for local SRV lookup issues only
```

`.env` is gitignored. Set `MONGODB_URI` (and optionally `DNS_SERVERS`) locally and add `MONGODB_URI` in Vercel dashboard → Settings → Environment Variables (Production). Never expose URI to frontend.

Optional local `DNS_SERVERS` is used only in `server/config/db.js` via `dns.setServers()` before `mongoose.connect()`. If absent, Node default DNS is used (correct for production).

## MongoDB Setup

1. Atlas → Create cluster → Network Access → Allow `0.0.0.0/0` (dev) or restrict.
2. Database Access → create user → copy `mongodb+srv://…` URI.
3. `MONGODB_URI` = `mongodb+srv://user:pass@cluster0.x.mongodb.net/Manage_Data_Panel?retryWrites=true&w=majority`
4. `server/config/db.js` caches `global.mongoose` for Vercel serverless (no new connection per invocation). Indexes: `type`, `linkStatus`, `downloadStatus`, `dateAdded`.

## Excel Import Workflow

1. Upload page (`/upload`): drag/drop or Choose File (accepts `.xlsx,.xls,.csv`, ≤10 MB).
2. Frontend `xlsx` reads `ArrayBuffer` → `XLSX.read(...,{cellDates:true})` first sheet → `sheet_to_json(header:1)` preserves header row.
3. Normalize headers: trim, lowercase, `_`→space, collapse spaces. Aliases per spec (e.g. `Full Name→name`, `Email Address→email`, `Mobile→phone`, `Company→organisation`, `Category→type`, `link_status→linkStatus`, `Added On→dateAdded`). Ambiguous (≥2 cols match same field) → mapping left `null` for manual selection.
4. Mapping UI: 9 selects (Name/Email/Phone/Type required, others optional `Ignore`). Import disabled until required mapped.
5. `validateRow` per mapped row: required name/email/phone/type, email regex, phone `^[0-9+\-()\s]{7,20}$`, type `Student→Students` etc. (unknown → error, not `Others`), link `Pending/Sent`, download `Pending/Downloaded/Completed`, date `ISO` (empty→now, invalid→error), empty rows skipped.
6. Shows `Total / Valid / Invalid (unique rows) / Empty skipped`, chips for mapped fields, `ValidationErrors` grouped by row, `PreviewTable` first 30 of `validRecords` (all sent).
7. `Import X valid` → `POST /api/records/import {records: validRecords}` (no file bytes). Button disabled + `Importing...` prevents duplicate. Backend re-validates all-or-nothing; on 400 preserves preview/mapping and shows `errors`. On 201 shows `N records imported successfully.` + `Upload Another`.

Test fixture (not hard-coded):

```csv
Name,Email,Phone,Address,Organisation,Type,Link Status,Download Status,Date Added
Rahul Sharma,rahul@example.com,9876543210,Indore,ABC College,Students,Pending,Pending,2026-09-28
Amit Verma,amit@example.com,9123456780,Bhopal,XYZ School,Teachers,Sent,Completed,2026-09-27
```

## API Overview

Base `/api` (relative, Vite proxies `/api → :5000` locally).

| Method | Path | Query/Body | Success | Error |
|---|---|---|---|---|
| GET | `/api/health` | — | `200 {success:true,data:{status:"ok",db:"connected",uptime}}` | — |
| GET | `/api/records` | `?page=1&limit=10&type=&search=&linkStatus=&downloadStatus=&dateRange=` (all optional, validated, `page≥1, limit1-100`, enums strict) | `200 {success:true,data:{records:[],pagination:{page,limit,total,totalPages}}}` sorted `dateAdded:-1`, `total` is filtered count, empty → 200 `[]` | `400` invalid enum/page/limit/search>100 |
| GET | `/api/records/summary` | — | `200 {success:true,data:{all,students,teachers,institutes}}` via `countDocuments` | `500` |
| GET | `/api/records/:id` | `ObjectId` | `200 {success:true,data:record}` | `400` invalid ID, `404` not found |
| POST | `/api/records/import` | `{records:[{name,email,phone,address,organisation,type,linkStatus,downloadStatus,dateAdded}]}` (required name/email/phone/type) | `201 {success:true,data:{insertedCount,records}}` all-or-nothing `insertMany` | `400` `records` not array/empty/>2000/invalid row → `{success:false,message:"Validation failed",errors:[{row,field,reason}]}` nothing inserted |
| PUT | `/api/records/:id` | body partial/full (preserves `dateAdded,_id`), validates required+enums | `200 {success:true,data:updated}` | `400` validation, `404` not found |
| DELETE | `/api/records/:id` | — | `200 {success:true,message:"Record deleted successfully"}` | `400` invalid ID, `404` not found |

All responses `{success, data|message, errors}`. `ObjectId` validated via `mongoose.Types.ObjectId.isValid`. Query built from whitelist (`parsePagination` + `buildFilter`), `search` escaped via `escapeRegex`, no `Model.find(req.query)`.

## Deployment

**Not yet deployed (Phase 7).** Ready config:

- `vercel.json`: `builds` `api/index.js→@vercel/node` + `package.json→@vercel/static-build distDir dist`, `routes` `/api/(.*)→/api/index.js`, `/(.*)→/index.html` (SPA fallback)
- `api/index.js`: `dotenv.config()`, cached `connectDB()`, `export default handler(req,res) => app(req,res)` — no `app.listen` in serverless path
- `server/app.js`: exports `app` without `listen`; `server/index.js` does `app.listen` only locally
- Env: set `MONGODB_URI` (and `PORT` optional) in Vercel → Settings → Environment Variables; `DNS_SERVERS` not needed in production
- Build: `npm run build` → `dist` (Vite) + `api` (Vercel)

Local verification before deploy: `npm run dev:server` → `MongoDB connected`, `curl /api/health` `db:connected`, `curl /api/records` `200`, `npm run build` `✓ 119 modules`.

## Known Limitations / Non-Goals

- No auth, audit logs, bulk update/delete, export, complex Dashboard/Social & Ads analytics.
- `xlsx` has known audit warning (prototype pollution/ReDoS) with no fix available — accepted per spec requirement.
- Chunk `700 kB` due to `xlsx` (not code-split for assignment scope).
- `Dashboard`/`Social & Ads` remain placeholders.

## Acceptance Checklist (local)

- [x] App starts locally, builds, API starts, MongoDB connects
- [x] Upload: .xlsx/.xls/.csv, invalid rejected, parse, mapping, required validated, row errors, preview, import, persistence
- [x] Manage Data: records via API, 7 category tabs, summary, search (name/email/phone), Link/Download/Date filters, Reset, pagination, S.N., badges, loading/empty/error, responsive
- [x] Update: modal prefilled, validation, PUT, persistence, refresh, dateAdded preserved, success/failure
- [x] Delete: confirm, DELETE, persistence, refresh, counts, pagination edge (last row page2→page1), failure keeps row
- [x] No secrets committed, `.env.example` exists, `README` complete, build passes
- [ ] Production Vercel URL/API/DB (Phase 7)
