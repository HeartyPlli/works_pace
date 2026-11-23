# 07. Troubleshooting

The most common beginner problems, and how to fix them.
Find your error message below (tip: press **Ctrl + F** and type a word from the error).

[Back to README](../README.md) | Before this: [06. Manual steps checklist](06-manual-steps-checklist.md) | Next: [08. How to add a feature](08-how-to-add-a-feature.md)

---

## First: where do I see errors?

- **Terminal 1 (`php artisan serve`)** shows each API request.
- **Laravel's log file:** `backend/storage/logs/laravel.log`. Open it and scroll to the **bottom** for the newest error.
- **The browser console:** in the browser press **F12**, then click the **Console** tab. Red lines are errors.
- **The browser Network tab:** press **F12**, click **Network**, then do the action again.
  Click the red request and look at **Response** to see what the API said.

---

## Composer, npm, php, or node is "not recognized"

**Error:**

```
'composer' is not recognized as an internal or external command, operable program or batch file.
```

(Or the same for `npm`, `php`, or `node`. On macOS or Linux: `command not found`.)

**Why:** the tool is not installed, or the terminal cannot find it (it is not in the PATH).

**Fix:**

1. Close **all** terminals (also the ones in VS Code), then open a new one. New tools are only seen by new terminals.
2. Still not working? Install the tool again ([01-install-tools.md](01-install-tools.md)).
3. For `php` on Windows with XAMPP: add `C:\xampp\php` to the PATH (see 01-install-tools.md, Step 1).
4. Still not working? Restart the computer.

---

## npm says "running scripts is disabled"

**Error (Windows PowerShell):**

```
npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.
```

**Fix:** open PowerShell and run this once. It lets PowerShell run scripts that you installed yourself:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Type `Y` and press **Enter** if it asks. Or use the **Command Prompt** (cmd) terminal instead of PowerShell.

---

## Composer says the zip extension is missing

**Error:**

```
The zip extension and unzip/7z commands are both missing, skipping.
```

**Fix:** open `C:\xampp\php\php.ini`, find `;extension=zip`, delete the `;`, and save.
Open a new terminal and run `composer install` again.

---

## Port is already in use

**What you see (Laravel):** the server starts on **8001** (or 8002...) instead of 8000:

```
   INFO  Server running on [http://127.0.0.1:8001].
```

**What you see (Vite):**

```
Port 5173 is in use, trying another one...
  ➜  Local:   http://localhost:5174/
```

**Why:** another program (often an old terminal you forgot) is already using port 8000 or 5173.
Laravel and Vite then move to the next free port by themselves.

**Why it matters:** React still calls port 8000 (from `VITE_API_URL`). So it talks to the OLD server,
or to nothing, and you get strange errors.

**Fix:**

1. Look for another terminal that is still running `php artisan serve` or `npm run dev`. Press **Ctrl + C** in it.
2. Or close VS Code completely and open it again. Still busy? Restart the computer.
3. Then stop your new server (**Ctrl + C**) and start it again. It should say port 8000 (or 5173).
4. If you really want another port for Laravel, choose it yourself: `php artisan serve --port=8001`.
   Then change `frontend/.env` to `VITE_API_URL=http://127.0.0.1:8001/api` and restart `npm run dev`.

---

## Database connection refused

**Error:**

```
SQLSTATE[HY000] [2002] No connection could be made because the target machine actively refused it
```

**Why:** MySQL is not running.

**Fix:** open the XAMPP Control Panel and click **Start** next to **MySQL**. Wait until it turns green. Try again.

If MySQL does not start (it turns red), another MySQL program may be using port 3306
(for example, Laragon and XAMPP at the same time). Stop the other one.

---

## Access denied or unknown database

**Errors:**

```
SQLSTATE[HY000] [1045] Access denied for user 'root'@'localhost'
SQLSTATE[HY000] [1049] Unknown database 'workspace'
```

**Fix:**

- **Access denied:** the user or password in `backend/.env` is wrong. With XAMPP, use `DB_USERNAME=root` and an empty `DB_PASSWORD=`.
- **Unknown database:** create the `workspace` database first ([02-setup-backend.md](02-setup-backend.md), Step 5).

After you change `.env`, run `php artisan config:clear`, then stop and start `php artisan serve` again.

---

## Forgot to run migrate (table not found)

**Error:**

```
SQLSTATE[42S02]: Base table or view not found: 1146 Table 'workspace.students' doesn't exist
```

**Why:** the database exists, but the tables were not made yet.

**Fix:** in the `backend` folder run:

```powershell
php artisan migrate
php artisan db:seed
```

---

## Seeding says it was skipped

**Message:**

```
The database already has accounts, so seeding is skipped.
```

**Why:** this is not an error. The database already has the two accounts, so `php artisan db:seed`
does nothing, to avoid adding everything twice.

**Fix:** you do not need to seed again. If you really want fresh sample data, run this
(it **deletes all data**):

```powershell
php artisan migrate:fresh --seed
```

> If you run ONE seeder by itself (for example `php artisan db:seed --class=UserSeeder`) a second time,
> you get `Duplicate entry 'officer@example.com' for key 'users_email_unique'`. Same fix: you do not need it again.

---

## Seeding stops with "Set OFFICER_PASSWORD and VIEWER_PASSWORD"

**Error:**

```
Set OFFICER_PASSWORD and VIEWER_PASSWORD before seeding a live website.
```

**Why:** `APP_ENV` is `production` (a live website), and the two password settings are missing.
The seeder stops on purpose, so a live website never gets the easy password `password`.

**Fix:** set both `OFFICER_PASSWORD` and `VIEWER_PASSWORD` (on Railway: the backend's **Variables** tab),
then seed or deploy again. On your own computer, keep `APP_ENV=local` in `backend/.env`.

---

## No application encryption key

**Error:**

```
No application encryption key has been specified.
```

**Fix:** in the `backend` folder run `php artisan key:generate`, then restart `php artisan serve`.

---

## 401 Unauthorized

**What you see:** the app sends you back to the login page, or the Network tab shows
`401` with `{"message":"Unauthenticated."}`.

**Why:** the request had no token, or the token is no longer valid (for example, you logged out,
or you ran `migrate:fresh`, which deletes all tokens).

**Fix:** log in again. This is normal after `migrate:fresh`.

If it happens right after every login, check that `frontend/src/api/client.js` still adds the
`Authorization` header, and that `routes/api.php` still has `Route::middleware('auth:sanctum')`.

---

## 403 "Only officers can do this"

**Why:** you are logged in as the **viewer**. Viewers can only read.

**Fix:** log out and log in as `officer@example.com`.

---

## CORS error

**Error (browser console):**

```
Access to XMLHttpRequest at 'http://127.0.0.1:8000/api/login' from origin 'http://localhost:5173'
has been blocked by CORS policy
```

**Why:** usually one of these:

1. The Laravel server is not running, or it crashed. (A crashed request often looks like a CORS error.)
2. `VITE_API_URL` in `frontend/.env` has a typo (for example, a missing `/api`, or the wrong port).
3. `FRONTEND_URL` is set in `backend/.env` (or on the server) to an address that does not match the React app,
   or `backend/config/cors.php` was changed.

**Fix:**

1. Check Terminal 1. Is `php artisan serve` running? Any red error there or in `storage/logs/laravel.log`?
2. Open `frontend/.env`. It should be exactly `VITE_API_URL=http://127.0.0.1:8000/api`.
   After changing it, stop `npm run dev` (**Ctrl + C**) and start it again.
3. On your own computer, `FRONTEND_URL` should stay commented out (`# FRONTEND_URL=...`) in `backend/.env`,
   so every origin is allowed. In `backend/config/cors.php`, `'paths'` must include `'api/*'`.
   Then run `php artisan config:clear`.
4. On a live website, see [10-deploy-to-railway.md, Part 7](10-deploy-to-railway.md#part-7-extra-safety-allow-only-your-website-to-call-the-api).

---

## "Cannot reach the server. Is the Laravel server running?"

**Why:** React could not get any answer from the API.

**Fix:** start the API in the `backend` folder with `php artisan serve`, and check `VITE_API_URL` in `frontend/.env`.

---

## Blank page (white screen)

**Why:** a JavaScript error stopped React, or the dev server is not running.

**Fix:**

1. Check Terminal 2. Is `npm run dev` running? Are there red errors?
2. Press **F12** in the browser and look at the **Console** tab. The red message says which file and line has the problem.
3. Common causes:
   - A typo in a `.jsx` file you just changed (Vite also shows a red error box on the page).
   - An `import` with a wrong file name. File names are case sensitive: `Modal.jsx` is not `modal.jsx`.
   - `Cannot read properties of undefined (reading 'map')`: you used `.map()` on data that is not loaded yet.
     Start the state with an empty list: `useState([])`.
4. Did you run `npm install`? Without it, the `node_modules` folder is missing.

---

## Class not found

**Errors:**

```
Target class [App\Http\Controllers\Api\StudentController] does not exist.
Class "App\Models\Student" not found
```

**Why:** the file name, the class name, or the `namespace` line do not match, or Composer's class list is old.

**Fix:**

1. The file name must match the class name exactly: `StudentController.php` has `class StudentController`.
2. The `namespace` at the top must match the folder:
   - `app/Http/Controllers/Api/` uses `namespace App\Http\Controllers\Api;`
   - `app/Models/` uses `namespace App\Models;`
3. At the top of the file that USES the class, check the `use` line (for example `use App\Models\Student;`).
4. Refresh Composer's class list:

   ```powershell
   composer dump-autoload
   ```

---

## Changes to .env do nothing

**Fix:**

- **Backend:** run `php artisan config:clear`, then stop (**Ctrl + C**) and start `php artisan serve` again.
- **Frontend:** stop (**Ctrl + C**) and start `npm run dev` again. Vite reads `.env` only when it starts.

---

## The Copy button says "Could not copy"

**Why:** the browser blocked the clipboard.

**Fix:** open the app at `http://localhost:5173` (not an IP address like `192.168.x.x`), and click the button
directly with your mouse. You can always select the text by hand and press **Ctrl + C**.

---

## Still stuck?

1. Read the **last** lines of `backend/storage/logs/laravel.log`.
2. Copy the exact error message and search for it on the internet.
3. When you solve it, add it to your **Error Fix Journal** in the app, so you never have to search again.

Next: [08. How to add a feature](08-how-to-add-a-feature.md)
