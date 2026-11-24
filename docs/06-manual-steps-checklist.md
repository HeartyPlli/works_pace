# 06. Manual steps checklist

The code cannot do everything by itself. These are the steps **you** must do by hand.
Tick each box when it is done. (In VS Code's Markdown preview, or on GitHub, you can see the boxes.
In a plain text editor, change `[ ]` to `[x]` yourself.)

[Back to README](../README.md) | Before this: [05. How the code works](05-how-the-code-works.md) | Next: [07. Troubleshooting](07-troubleshooting.md)

---

## A. Install the tools (one time per computer)

Guide: [01-install-tools.md](01-install-tools.md)

- [ ] Install PHP 8.2 or newer (XAMPP or Laragon on Windows). Check: `php -v`
- [ ] Windows with XAMPP: add `C:\xampp\php` to the PATH.
- [ ] Turn on `extension=zip` in `php.ini` (remove the `;` in front of it, then save).
- [ ] Install Composer. Check: `composer --version`
- [ ] Install Node.js 20.19 or newer (or 22.12 or newer). Check: `node -v` and `npm -v`
- [ ] Install VS Code.
- [ ] Install Git. Check: `git --version`
- [ ] Close all old terminals and open a new one (so it knows about the new tools).

## B. Set up the backend (one time per computer)

Guide: [02-setup-backend.md](02-setup-backend.md). Type these commands in the `backend/filee` folder.

- [ ] Start MySQL (XAMPP Control Panel: click **Start** next to MySQL).
- [ ] Run `composer install`
- [ ] Copy `.env.example` to `.env` (`Copy-Item .env.example .env`)
- [ ] Run `php artisan key:generate`
- [ ] Create an empty database named `workspace` (phpMyAdmin or the command line).
- [ ] Check `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD` in `backend/filee/.env`.
- [ ] Run `php artisan migrate`
- [ ] Run `php artisan db:seed`

## C. Set up the frontend (one time per computer)

Guide: [03-setup-frontend.md](03-setup-frontend.md). Type these commands in the `frontend/filee` folder.

- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env` (`Copy-Item .env.example .env`)
- [ ] Check `VITE_API_URL` in `frontend/filee/.env` (normally `http://127.0.0.1:8000/api`).

## D. Every time you use the app

Guide: [04-run-the-app.md](04-run-the-app.md)

- [ ] Start MySQL.
- [ ] Terminal 1, in `backend/filee`: `php artisan serve`
- [ ] Terminal 2, in `frontend/filee`: `npm run dev`
- [ ] Open http://localhost:5173 and log in.

## E. Change the default passwords (before real people use the app)

Everybody who has seen this project knows that both accounts use the password `password`.
The app has no "change password" page, so use **Tinker**. Tinker is a Laravel tool where you can type PHP code
and run it right away.

- [ ] **Step 1.** In the `backend/filee` folder, start Tinker:

  ```powershell
  php artisan tinker
  ```

  You see a prompt that starts with `>`.

- [ ] **Step 2.** Change the officer password. Type each line and press **Enter** after each one.
  Put your own strong password between the quotes:

  ```php
  $user = App\Models\User::where('email', 'officer@example.com')->first();
  $user->password = 'type-a-strong-password-here';
  $user->save();
  ```

  After `save()` you should see `= true`.
  You do not need to scramble (hash) the password yourself. The `User` model does it for you when it saves.

- [ ] **Step 3.** Do the same for the viewer account (`viewer@example.com`).

- [ ] **Step 4 (optional).** Change the emails to real ones:

  ```php
  $user = App\Models\User::where('email', 'officer@example.com')->first();
  $user->email = 'secretary@yourschool.edu';
  $user->name = 'Your Name';
  $user->save();
  ```

- [ ] **Step 5.** Type `exit` and press **Enter** to leave Tinker.
- [ ] **Step 6.** Log out of the app and log in with the new password to check it.

> Another way: before you run `php artisan db:seed` the first time, set `OFFICER_PASSWORD` and
> `VIEWER_PASSWORD` in `backend/filee/.env` (remove the `#` in front of them). The seeder uses them instead of `password`.
> On a live website this is required: see [10-deploy-to-railway.md](10-deploy-to-railway.md).

## F. Before you upload to GitHub

Guide: [09-put-it-on-github.md](09-put-it-on-github.md)

- [ ] Run `git status` and check that no `.env`, `vendor`, `node_modules`, or `.sql` file is in the list.
- [ ] Keep database backups (`.sql` files) OUTSIDE the project folder.
- [ ] Never put real student data in a public repository.

## G. Only if you put the app on the internet

You do not need these while you learn on your own computer.
Full step by step guide: [10-deploy-to-railway.md](10-deploy-to-railway.md)

- [ ] Set `APP_ENV=production` and `APP_DEBUG=false` on the server (so error details stay hidden).
- [ ] Set strong `OFFICER_PASSWORD` and `VIEWER_PASSWORD` on the server BEFORE the first seed.
- [ ] Set `FRONTEND_URL` on the server to your React app's address, so only your website can call the API.
- [ ] Use `https://` addresses for both the API and the React app.
- [ ] Do not use `php artisan migrate:fresh` there. It deletes all data.
- [ ] Know how to stop the costs (delete the project on the hosting service).

---

Next: [07. Troubleshooting](07-troubleshooting.md)
