# Workspace

Workspace is a small web app with two parts (we call them "modules"):

1. **Council Records and Collections**: for a student council secretary. Keep resolutions, students, fees and penalties, and payments in one place.
2. **Error Fix Journal**: a personal notebook for programming errors you have already solved, so you can find the fix fast next time.

Both modules share one login page and one menu on the left side of the screen (the "sidebar").

This project is made for learning. The code is kept simple on purpose, and every file starts with a short comment that says what it does.

---

## What the app can do

**Homepage** (address `/`, anyone can see it)
- A short welcome page with the two features, three "how it works" steps, and a **Log in** button.
  (When you are already logged in, the button says **Open dashboard**.)

**Dashboard** (address `/dashboard`, the first page after login)
- Total money collected and total money still unpaid.
- The 5 latest resolutions.
- The 5 errors you met the most times.
- Quick links, and (for officers) buttons to add a resolution or a journal entry.

**Look and feel**
- **Light and dark mode:** the sun and moon switch (top right). Your choice is remembered.
- **Works on phones:** on a small screen the menu hides behind a menu button (top left).
- A logo (`frontend/filee/public/workspace-logo.png`) on the homepage, the login page, the menu, and the browser tab.

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
  backend/
    filee/         <- ALL the files of the Laravel API (PHP). It talks to the database.
  frontend/
    filee/         <- ALL the files of the React app (JavaScript). This is what you see in the browser.
```

Every file the backend needs is inside `backend/filee`, and every file the frontend needs is inside `frontend/filee`.
So you always open a terminal **inside a `filee` folder** to run commands (`cd backend\filee` or `cd frontend\filee`).

On your computer, each `filee` folder also holds things that are NOT uploaded to GitHub
(their `.gitignore` file takes care of that): your `.env` file with passwords, and the downloaded packages
(`vendor` for the backend, `node_modules` for the frontend). They are needed to run the app on your computer,
and anyone can make them again with `composer install`, `npm install`, and `.env.example`.

- The **backend** is the "kitchen". It keeps the data in a MySQL database and answers requests.
- The **frontend** is the "dining room". It shows pages, and asks the backend for data.
- They talk to each other through an **API** (a list of web addresses that send and receive data).

**The folders you will work in** (everything you write is here):

```
backend/filee/
  app/Http/Controllers/   <- the code that answers each request (one file per topic)
  app/Http/Middleware/    <- OfficerOnly.php, the guard that lets only officers change data
  app/Models/             <- one file for each database table
  database/migrations/    <- the files that create the tables
  database/seeders/       <- the files that fill the tables with starting data
  routes/api.php          <- the list of API addresses

frontend/filee/src/
  pages/                  <- one file for each screen (and the small forms those screens use)
  components/             <- parts many pages share: sidebar, top bar, logo, icons, table, pop up,
                             login state, and light or dark mode
  api/                    <- the functions that call the backend
  helpers.js              <- small helpers: money and date format, resolution numbers, error messages
  App.jsx                 <- the list of pages (which address shows which page)
  index.css, design.css   <- the styles (design.css is the look: colors, light and dark mode)

frontend/filee/public/
  workspace-logo.png      <- the logo picture
```

### Every file, explained

The project only has files that the app really uses. Here is what each one is for.

**`backend/filee`** (56 files)

| File or folder | What it is |
|----------------|------------|
| `.env.example` | The list of settings. Copy it to `.env` and put your own values there. |
| `.gitignore`, `.gitattributes` | Git settings: which files NOT to upload, and the same line endings on every computer. |
| `artisan` | Laravel's helper program: `php artisan serve`, `php artisan migrate`, and so on. |
| `composer.json`, `composer.lock` | The list of PHP packages (Laravel, Sanctum for login tokens, Tinker) and their exact versions. |
| `app/Http/Controllers/` | 10 controllers: the code that answers each API request (one file per topic). |
| `app/Http/Middleware/OfficerOnly.php` | The guard that stops viewers from changing data. |
| `app/Models/` | 8 models: one per database table, with the links between tables. |
| `bootstrap/app.php` | Starts Laravel: loads the route files, names the `officer` guard, sends errors as JSON. |
| `bootstrap/cache/` | Laravel saves speed up files here by itself. Do not edit. |
| `config/cors.php` | Which websites may call the API. (For all other settings Laravel uses its built in defaults.) |
| `database/migrations/` | 10 files that create the tables: users and sessions, our 8 tables, and the login tokens table. |
| `database/seeders/` | 6 files that fill the tables with the two accounts and the sample data. |
| `public/index.php` | The door every request comes through. Do not edit. |
| `resources/views/README.md` | Keeps an empty folder that Laravel needs. This app has no Laravel pages (React shows the pages). |
| `routes/api.php` | The list of all API addresses. |
| `routes/web.php` | Only the "The Workspace API is running" message at `/`. |
| `storage/` | Laravel writes logs, sessions, and cache files here. The small `.gitignore` files inside only keep the empty folders on GitHub. Your errors are in `storage/logs/laravel.log`. |
| `.env`, `vendor/` | **Only on your computer**, never on GitHub: your settings, and the downloaded packages (`composer install`). |

**`frontend/filee`** (48 files)

| File or folder | What it is |
|----------------|------------|
| `.env.example` | The API address. Copy it to `.env`. |
| `.gitignore`, `.gitattributes` | Git settings, same as the backend. |
| `index.html` | The only HTML page. React puts every screen inside it. It also sets light or dark mode early, so the page does not flash. |
| `package.json`, `package-lock.json` | The list of JavaScript packages (React, axios, ...), the `npm run dev` command, and exact versions. |
| `vite.config.js` | Settings for Vite, the tool that runs the React app (port 5173). |
| `public/workspace-logo.png` | The logo picture. Files in `public` are used as they are (here: `/workspace-logo.png`). |
| `src/main.jsx` | The starting point of the React app. |
| `src/App.jsx` | The list of pages: which address shows which page. |
| `src/index.css` | The basic styles: layout, spacing, tables, forms, and the print page. |
| `src/design.css` | The look: colors, light and dark mode, the homepage, sidebar, top bar, and cards. It loads after `index.css`, so it wins. |
| `src/helpers.js` | Small helpers: money and date format, resolution numbers, error messages. |
| `src/api/` | `client.js` (the axios setup that adds the login token) and one file of API functions per module. |
| `src/components/` | Shared parts: `Layout`, `Sidebar`, `Topbar`, `Brand` (logo and name), `Icon` (the small icons), `SearchBar`, `Modal`, `DataTable`, `CodeBox`, plus `AuthContext` (who is logged in), `ThemeContext` (light or dark mode), and `ProtectedRoute` (the login guard). |
| `src/pages/` | 18 files: the homepage, one file per screen, and the small pop up forms those screens open. |
| `.env`, `node_modules/` | **Only on your computer**, never on GitHub: your API address, and the downloaded packages (`npm install`). |

A longer tour is in [docs/05-how-the-code-works.md](docs/05-how-the-code-works.md).

---

## Quick start checklist

Do these in order. Each step links to a guide with every detail.

1. Install PHP 8.2 or newer, Composer, Node.js, MySQL, VS Code, and Git.
   Guide: [docs/01-install-tools.md](docs/01-install-tools.md)
2. Start MySQL (in XAMPP, click **Start** next to MySQL).
3. Open a terminal in the `backend/filee` folder and run `composer install`.
   Guide: [docs/02-setup-backend.md](docs/02-setup-backend.md)
4. Copy `backend/filee/.env.example` to `backend/filee/.env`, then run `php artisan key:generate`.
5. Create an empty database named `workspace` (with phpMyAdmin or the command line).
6. Check the database values in `backend/filee/.env`, then run `php artisan migrate --seed`.
7. Start the API with `php artisan serve` and leave that terminal open.
8. Open a second terminal in the `frontend/filee` folder, run `npm install`, and copy `.env.example` to `.env`.
   Guide: [docs/03-setup-frontend.md](docs/03-setup-frontend.md)
9. Run `npm run dev` and open http://localhost:5173 in your browser. You see the homepage.
   Guide: [docs/04-run-the-app.md](docs/04-run-the-app.md)
10. Click **Log in**, log in with `officer@example.com` / `password` (you land on `/dashboard`), then change the default passwords.
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

## Deploy tutorial: from GitHub to a live website (only what is needed)

This tutorial puts Workspace on the internet, so you can open it from any phone or computer.
We use **Railway**, a hosting service that builds the app straight from your GitHub repository.
Only the two `filee` folders are needed for the website. Railway builds nothing else.

More details and a troubleshooting table: [docs/10-deploy-to-railway.md](docs/10-deploy-to-railway.md).

### What is needed, and what is not

| Folder or file | Needed for the website? | On GitHub? | Deployed by Railway? |
|----------------|-------------------------|------------|----------------------|
| `backend/filee` (Laravel API) | **Yes** | Yes | Yes, as the service `backend` |
| `frontend/filee` (React app) | **Yes** | Yes | Yes, as the service `frontend` |
| `README.md`, `docs/`, top `.gitignore` and `.gitattributes` | No, they are instructions and Git settings | Yes, but optional (see Step 1) | No |
| `.env`, `vendor`, `node_modules`, `*.sql` backups | **Never** | No, blocked by `.gitignore` | No. Railway installs the packages itself, and settings go in Railway's **Variables** |

### Before you start

- **Cost** (checked November 2026, see https://railway.com/pricing): free for the first 30 days
  (a one-time $5 credit, no credit card), then the Hobby plan, $5 per month.
- **An app key for the live server.** In a terminal, run:

  ```powershell
  cd backend\filee
  php artisan key:generate --show
  ```

  Copy the whole line it prints (it starts with `base64:`). This does not change your own `.env`.
- **Two strong passwords**, one for the officer account and one for the viewer account (at least 12 characters).

### Step 1. Push your code to GitHub

In the **top** `workspace` folder (the one with this README), check what Git will upload:

```powershell
git status
```

You must NOT see `.env`, `vendor`, `node_modules`, or any `.sql` file. Then upload:

```powershell
git add .
git commit -m "Ready to deploy"
git push
```

If `git commit` says `nothing to commit`, that is fine. Still run `git push`.
(First time on GitHub? Follow [docs/09-put-it-on-github.md](docs/09-put-it-on-github.md) first.)

> **Optional: keep ONLY the two `filee` folders on GitHub.**
> The website works without the README and docs on GitHub. If you want your repository to hold only
> `backend/filee` and `frontend/filee`, run these in the top `workspace` folder:
>
> ```powershell
> git rm -r --cached README.md docs .gitignore .gitattributes
> Add-Content .git\info\exclude "README.md"
> Add-Content .git\info\exclude "docs/"
> Add-Content .git\info\exclude ".gitignore"
> Add-Content .git\info\exclude ".gitattributes"
> git commit -m "Keep only the filee folders on GitHub"
> git push
> ```
>
> - `git rm --cached` removes the files from GitHub but **keeps them on your computer**.
> - The `exclude` lines stop `git add .` from adding them again. (This list stays on your computer only.)
> - Each `filee` folder has its own `.gitignore`, so `.env`, `vendor`, `node_modules`, and `.sql` files stay blocked.
> - The old versions of the README and docs stay in the repository's history.
> - Downside: people who visit your GitHub page do not see any instructions.
> - To undo: delete those four lines from `.git\info\exclude`, then run `git add .`, `git commit -m "Add the guides back"`, and `git push`.

### Step 2. Make a Railway project with a MySQL database

1. Go to https://railway.com and **sign in with GitHub** (the account that has your repository).
2. Click **New Project**, then **Database**, then **MySQL**. Wait until the **MySQL** box shows that it is running.
   Keep its name `MySQL` (Step 3 uses it).

### Step 3. Deploy the backend (only `backend/filee`)

1. In the project, click **+ New**, then **GitHub Repo**, and pick your **workspace** repository.
   (Allow Railway to see that repository if it asks.) The first build may fail. That is normal, we fix it now.
2. Click the new box and open **Settings**:
   - **Service name:** `backend`
   - **Root Directory:** `/backend/filee` (so Railway uses ONLY this folder)
   - **Watch Paths:** `/backend/filee/**` (so the backend is rebuilt ONLY when this folder changes)
   - **Pre-deploy Command:** `php artisan migrate --force && php artisan db:seed --force`
3. Open **Variables**, click **Raw Editor**, paste this, and fill in the 3 marked values:

   ```
   APP_NAME=Workspace
   APP_ENV=production
   APP_DEBUG=false
   APP_KEY=paste-the-base64-key-here
   DB_CONNECTION=mysql
   DB_URL=${{MySQL.MYSQL_URL}}
   LOG_CHANNEL=stderr
   CACHE_STORE=file
   QUEUE_CONNECTION=sync
   OFFICER_PASSWORD=your-strong-officer-password
   VIEWER_PASSWORD=your-strong-viewer-password
   ```

   Add `SEED_SAMPLE_DATA=false` too if you want the website to start with no sample data.
4. Click **Deploy**. When the deployment says **Success**, go to **Settings > Networking** and click **Generate Domain**
   (if it asks for a port, use the one it suggests).
5. Open the new address. You should see `{"message":"The Workspace API is running. Open the React app to use it."}`

### Step 4. Deploy the frontend (only `frontend/filee`)

1. Click **+ New**, then **GitHub Repo**, and pick **workspace** again.
2. In **Settings**:
   - **Service name:** `frontend`
   - **Root Directory:** `/frontend/filee`
   - **Watch Paths:** `/frontend/filee/**`
3. In **Variables**, add one variable:

   ```
   VITE_API_URL=https://${{backend.RAILWAY_PUBLIC_DOMAIN}}/api
   ```

4. Click **Deploy**. When it says **Success**, go to **Settings > Networking** and click **Generate Domain**.

### Step 5. Visit your website

Open the frontend's address (like `https://frontend-production-1234.up.railway.app`). **This is your website.**
You see the homepage. Click **Log in**, and log in with `officer@example.com` and **your OFFICER_PASSWORD**
(not "password"). You land on the dashboard (`/dashboard`). Share the website address with others.

### Updating the website later

Just push to GitHub. Thanks to the Root Directory and Watch Paths, Railway deploys only what changed:

| You change something in... | What Railway does |
|----------------------------|-------------------|
| `backend/filee` | Rebuilds only the backend. New migrations run by themselves. Your live data stays. |
| `frontend/filee` | Rebuilds only the frontend. |
| `README.md` or `docs/` | Nothing. No deploy at all. |

### If something goes wrong

- Open the service, then **Deployments**, then the newest deployment, and read **Build Logs** and **Deploy Logs**.
- "Set OFFICER_PASSWORD and VIEWER_PASSWORD" in the logs: add both variables to the **backend** (Step 3).
- The website says "Cannot reach the server": open the backend's address first. Then check `VITE_API_URL` (Step 4) and deploy the frontend again.
- More fixes: [docs/10-deploy-to-railway.md, Part 8](docs/10-deploy-to-railway.md#part-8-troubleshooting).

**To stop paying:** open the project's **Settings** and delete the project (this also deletes the live database).

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
| Styles | Two plain CSS files: `index.css` (basic layout) and `design.css` (the look, light and dark mode) | No Tailwind or UI library, so nothing extra to learn. |
| Icons | Drawn with SVG in `src/components/Icon.jsx` | No icon library to install. |
| Pages | `/` is the public homepage, `/dashboard` is the first page after login | Visitors see what the app is before they log in. |
| API address | http://127.0.0.1:8000/api | Laravel's normal address. |
| React address | http://localhost:5173 | Vite's normal address. |
| Money | Shown as `PHP 1,250.00` | Plain text, works in every font. |
| Journal entries | Every logged in user can read every entry | Viewers can read, but only officers can add or change. |
| Deleting a student | Also deletes their charges and payments | The app asks "Are you sure?" first. |
| Payments | Cannot be bigger than the balance | Stops mistakes like typing 1500 instead of 150. |
| CORS | All origins allowed (`*`), unless `FRONTEND_URL` is set (`backend/filee/config/cors.php`) | Fine with token login while learning. On a live website, set `FRONTEND_URL`. |
| Seeding | Safe to run again: it skips itself when the accounts exist | A live website runs it on every deploy without adding things twice. |
| Hosting | Railway (MySQL + backend + frontend from one GitHub repo) | Easiest path from `git push` to a live website. Checked November 2026. |
