# Workspace

Workspace is a small web app with two parts (we call them "modules"):

1. **Council Records and Collections**: for a student council secretary. Keep resolutions, students, fees and penalties, and payments in one place.
2. **Error Fix Journal**: a personal notebook for programming errors you have already solved, so you can find the fix fast next time.

Both modules share one login page and one menu on the left side of the screen (the "sidebar").

This project is made for learning. The code is kept simple on purpose, and every file starts with a short comment that says what it does.

---

## What the app can do

**Dashboard (home page)**
- Total money collected and total money still unpaid.
- The 5 latest resolutions.
- The 5 errors you met the most times.

**Council Records and Collections**
- **Resolutions:** add, edit, delete, list, and search. Filter by year and by status (draft, adopted, filed).
  Numbers are made for you, like "Resolution No. 0004, Series of 2026". The number starts again at 1 every year.
  Each resolution has a clean print page (it uses your browser's print window).
- **Students:** add, edit, delete, list, and search.
- **Charges:** a charge is a fee (example: Membership Fee, PHP 150) or a penalty (example: Absence Penalty, PHP 25). A charge can be linked to the resolution that approved it.
- **Assign charges:** give a charge to one student or to many students at once.
- **Payments:** record a payment (amount, date, receipt number). A student can pay in parts.
- **Student ledger:** one student's charges, payments, and balance on one page.
- **Unpaid report:** every student who still owes money, and the total owed.

**Error Fix Journal**
- Entries with a title, error message, cause, fix, code snippet, and source link.
- Tags (example: Laravel, React, CORS) and a filter by tag.
- Search by text in the title or error message.
- A "Seen again" button that adds 1 to the "seen" counter.
- A favorite star.
- Code is shown in a grey box with a Copy button.

**Login and roles**
- **officer:** can do everything.
- **viewer:** can only look. Add, Edit, and Delete buttons are hidden, and the API blocks changes too.

---

## Default login accounts

| Role    | Email                 | Password   |
|---------|-----------------------|------------|
| officer | officer@example.com   | password   |
| viewer  | viewer@example.com    | password   |

> **IMPORTANT:** Everybody who reads this README knows these passwords.
> Change them before real people use the app.
> See part E of [docs/06-manual-steps-checklist.md](docs/06-manual-steps-checklist.md#e-change-the-default-passwords-before-real-people-use-the-app).
> On a live website you MUST choose your own passwords (`OFFICER_PASSWORD` and `VIEWER_PASSWORD`).
> The app refuses to use `password` there. See [docs/10-deploy-to-railway.md](docs/10-deploy-to-railway.md).

---

## The folders, in plain words

```
workspace/
  README.md        <- this file
  docs/            <- step by step guides (start here if you are new)
  backend/         <- the Laravel API (PHP). It talks to the database.
  frontend/        <- the React app (JavaScript). This is what you see in the browser.
```

- The **backend** is the "kitchen". It keeps the data in a MySQL database and answers requests.
- The **frontend** is the "dining room". It shows pages, and asks the backend for data.
- They talk to each other through an **API** (a list of web addresses that send and receive data).

**The folders you will work in** (everything you write is here):

```
backend/
  app/Http/Controllers/   <- the code that answers each request (one file per topic)
  app/Http/Middleware/    <- OfficerOnly.php, the guard that lets only officers change data
  app/Models/             <- one file for each database table
  database/migrations/    <- the files that create the tables
  database/seeders/       <- the files that fill the tables with starting data
  routes/api.php          <- the list of API addresses

frontend/src/
  pages/                  <- one file for each screen (and the small forms those screens use)
  components/             <- parts many pages share: sidebar, top bar, table, pop up, login state
  api/                    <- the functions that call the backend
  helpers.js              <- small helpers: money and date format, resolution numbers, error messages
  App.jsx                 <- the list of pages (which address shows which page)
```

**The folders you can ignore** (Laravel, Node.js, or Git make and use them; you rarely open them):

- `backend/bootstrap`, `backend/config`, `backend/public`, `backend/storage`
  (except `storage/logs/laravel.log`, where Laravel writes its errors)
- `backend/vendor` and `frontend/node_modules` : downloaded packages. Never edit these.
- `backend/app/Providers` : Laravel's start up file. This app does not change it.

A longer tour is in [docs/05-how-the-code-works.md](docs/05-how-the-code-works.md).

---

## Quick start checklist

Do these in order. Each step links to a guide with every detail.

1. Install PHP 8.2 or newer, Composer, Node.js, MySQL, VS Code, and Git.
   Guide: [docs/01-install-tools.md](docs/01-install-tools.md)
2. Start MySQL (in XAMPP, click **Start** next to MySQL).
3. Open a terminal in the `backend` folder and run `composer install`.
   Guide: [docs/02-setup-backend.md](docs/02-setup-backend.md)
4. Copy `backend/.env.example` to `backend/.env`, then run `php artisan key:generate`.
5. Create an empty database named `workspace` (with phpMyAdmin or the command line).
6. Check the database values in `backend/.env`, then run `php artisan migrate --seed`.
7. Start the API with `php artisan serve` and leave that terminal open.
8. Open a second terminal in the `frontend` folder, run `npm install`, and copy `.env.example` to `.env`.
   Guide: [docs/03-setup-frontend.md](docs/03-setup-frontend.md)
9. Run `npm run dev` and open http://localhost:5173 in your browser.
   Guide: [docs/04-run-the-app.md](docs/04-run-the-app.md)
10. Log in with `officer@example.com` / `password`, then change the default passwords.
    Guide: [docs/06-manual-steps-checklist.md](docs/06-manual-steps-checklist.md)

Something went wrong? See [docs/07-troubleshooting.md](docs/07-troubleshooting.md).

---

## Putting it on GitHub

- You can upload this project to GitHub, and it keeps working. Your passwords (`.env` files) and the downloaded
  packages (`vendor`, `node_modules`) are NOT uploaded. The `.gitignore` files take care of that.
- The database is NOT uploaded either. The migrations and seeders rebuild it: anyone who downloads the project
  runs `php artisan migrate --seed` and gets the same tables and sample data.
- Never upload real student data or database backups (`.sql` files) to GitHub.
- GitHub keeps your code, but it cannot run PHP or MySQL, so it cannot host the whole app live.

Step by step: [docs/09-put-it-on-github.md](docs/09-put-it-on-github.md)

---

## Putting it online (a website you can visit)

The project is ready to run on **Railway**, a hosting service that builds it straight from your GitHub repository.
You make three parts in one Railway project: a **MySQL** database, the **backend** (Laravel API), and the
**frontend** (React app). After that, every `git push` updates the website by itself.

- **Cost:** free for the first 30 days (a one-time $5 credit, no credit card), then about $5 per month (Hobby plan).
- **Safety:** on the live website you choose your own passwords, error details are hidden, and the database is
  not open to the internet.

Step by step: [docs/10-deploy-to-railway.md](docs/10-deploy-to-railway.md)

---

## All the guides

| File | What it teaches |
|------|-----------------|
| [01-install-tools.md](docs/01-install-tools.md) | Install PHP, Composer, Node.js, MySQL, VS Code, and Git |
| [02-setup-backend.md](docs/02-setup-backend.md) | Set up the Laravel API and the database |
| [03-setup-frontend.md](docs/03-setup-frontend.md) | Set up the React app |
| [04-run-the-app.md](docs/04-run-the-app.md) | Run both parts, log in, and a tour of every page |
| [05-how-the-code-works.md](docs/05-how-the-code-works.md) | The folders and files, and one full example (Login) step by step |
| [06-manual-steps-checklist.md](docs/06-manual-steps-checklist.md) | Everything you must do by hand, with checkboxes |
| [07-troubleshooting.md](docs/07-troubleshooting.md) | Common errors and how to fix them |
| [08-how-to-add-a-feature.md](docs/08-how-to-add-a-feature.md) | Add a new field and a new page yourself |
| [09-put-it-on-github.md](docs/09-put-it-on-github.md) | Upload to GitHub safely, back up and move the database |
| [10-deploy-to-railway.md](docs/10-deploy-to-railway.md) | Deploy it to a live website you can visit (Railway) |

---

## Versions and choices

We had to choose some things. Here they are, so you know what to expect.

| Thing | Choice | Why |
|-------|--------|-----|
| PHP | 8.2 or newer | Laravel 12 needs PHP 8.2 or newer. XAMPP comes with PHP 8.2. |
| Laravel | 12 | Laravel 13 needs PHP 8.3, so we use Laravel 12 to work with XAMPP's PHP 8.2. |
| Login | Laravel Sanctum with **bearer tokens** | No cookies, so there are fewer CORS problems for beginners. |
| Database | MySQL (XAMPP's MariaDB also works) | Database name: `workspace`. |
| React | React 19 with Vite 8 | Vite 8 needs Node.js 20.19 or newer (or 22.12 or newer). |
| Pages | react-router-dom 7 | One address per page, like `/students`. |
| API calls | axios 1 | Easy to add the login token to every request. |
| Styles | One plain CSS file: `frontend/src/index.css` | No Tailwind or UI library, so nothing extra to learn. |
| API address | http://127.0.0.1:8000/api | Laravel's normal address. |
| React address | http://localhost:5173 | Vite's normal address. |
| Money | Shown as `PHP 1,250.00` | Plain text, works in every font. |
| Journal entries | Every logged in user can read every entry | Viewers can read, but only officers can add or change. |
| Deleting a student | Also deletes their charges and payments | The app asks "Are you sure?" first. |
| Payments | Cannot be bigger than the balance | Stops mistakes like typing 1500 instead of 150. |
| CORS | All origins allowed (`*`), unless `FRONTEND_URL` is set (`backend/config/cors.php`) | Fine with token login while learning. On a live website, set `FRONTEND_URL`. |
| Seeding | Safe to run again: it skips itself when the accounts exist | A live website runs it on every deploy without adding things twice. |
| Hosting | Railway (MySQL + backend + frontend from one GitHub repo) | Easiest path from `git push` to a live website. Checked November 2026. |
