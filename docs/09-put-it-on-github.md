# 09. Put the project on GitHub (and what to do with the database)

This guide shows how to upload Workspace to GitHub so that it **keeps working**, both on your computer
and for anyone who downloads it. It also explains what happens to the **database**.

[Back to README](../README.md) | Before this: [08. How to add a feature](08-how-to-add-a-feature.md) | Next: [10. Deploy to a live website](10-deploy-to-railway.md)

---

## The short answer

1. **GitHub keeps your code. It does not run your app.**
   After you upload, the app on your computer works exactly as before. Nothing moves or breaks.
2. **The database is NOT uploaded, and it does not need to be.**
   The project already has the "recipe" for the database: the **migrations** (the tables) and the **seeders** (the sample data).
   Anyone who downloads the project runs `php artisan migrate --seed` and gets the same tables and the same sample data.
3. **Your secrets are NOT uploaded.** The `.env` files (database password, app key) are on the ignore list.
   Each computer makes its own `.env` from `.env.example`.
4. **GitHub cannot give you a live link for the whole app**, because GitHub cannot run PHP or MySQL.
   See [Part 6](#part-6-can-i-make-it-live-on-the-internet) and the live website guide,
   [10-deploy-to-railway.md](10-deploy-to-railway.md).

> **Tested:** we uploaded this project to a test Git repository, downloaded it into a new empty folder,
> followed guides 02 and 03, and logged in. It worked, with the same sample data.

---

## New words

- **Git:** a program on your computer that saves versions ("snapshots") of your project.
- **GitHub:** a website that keeps a copy of your Git project online (github.com).
- **Repository (repo):** one project in Git or on GitHub.
- **Commit:** one saved snapshot, with a short message like "Add student contact number".
- **Push:** send your commits from your computer to GitHub.
- **Clone:** download a repository from GitHub to a computer.
- **.gitignore:** a file with a list of files and folders that Git must NOT save or upload.
- **Public repository:** anyone on the internet can see the code. **Private:** only you and the people you invite.
- **Database backup (SQL dump):** one `.sql` text file with all the tables and data of a database.

---

## Part 1. What goes to GitHub, and what does not

| Uploaded to GitHub | NOT uploaded | Why not |
|--------------------|--------------|---------|
| All the code in `backend/` and `frontend/` | `backend/filee/.env` and `frontend/filee/.env` | They have your passwords and secret key. |
| `README.md` and `docs/` | `backend/filee/vendor/` | Composer downloads it again with `composer install`. |
| `.env.example` files (no secrets inside) | `frontend/filee/node_modules/` | npm downloads it again with `npm install`. |
| `composer.lock` and `package-lock.json` | `frontend/filee/dist/` | `npm run build` makes it again. |
| Migrations and seeders (the database recipe) | `backend/filee/storage/logs/*.log` | Log files are only for your computer. |
| | Any `*.sql` file | Database backups can hold real student data. |
| | The MySQL database itself | It lives inside MySQL, not in the project folder. |

This is already set up for you in three `.gitignore` files: one in the top `workspace` folder,
one in `backend/filee/`, and one in `frontend/filee/`.

The lock files (`composer.lock` and `package-lock.json`) ARE uploaded on purpose.
They make sure that everyone who downloads the project gets the exact same package versions.

---

## Part 2. Make a repository on GitHub

1. Go to https://github.com and sign up (or log in).
2. Click the **+** in the top right corner, then **New repository**.
3. **Repository name:** `workspace` (or any name you like).
4. Choose **Public** or **Private**:
   - **Public:** good for a portfolio. It is safe, because no passwords are in the code.
   - **Private:** good if your teacher wants it private, or if you are not sure yet. You can change it later.
5. **Do NOT tick** "Add a README file", "Add .gitignore", or "Choose a license".
   The project already has these files, and an extra file on GitHub makes your first upload fail.
6. Click **Create repository**.
7. GitHub shows a page with an address like `https://github.com/YOUR-NAME/workspace.git`. Keep this page open.

---

## Part 3. Upload the project from your computer

### Step 1. Open a terminal in the TOP folder

Open the `workspace` folder in VS Code and open a terminal. Make sure you are in the **top** folder
(the one with `README.md`, `backend`, and `frontend`), not inside `backend`, `frontend`, or a `filee` folder.
If you are inside a `filee` folder, type `cd ..\..` to go up two folders.

### Step 2. Tell Git your name (one time per computer)

```powershell
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Use the same email as your GitHub account. Nothing is printed when it works.

### Step 3. Start Git in the project

```powershell
git init -b main
```

**When it works:** `Initialized empty Git repository in .../workspace/.git/`

(`main` is the name of the main "branch", the main line of your project's history.)

### Step 4. Check what Git will upload (IMPORTANT)

```powershell
git status
```

You see a list of folders and files in red, like `.gitattributes`, `.gitignore`, `README.md`, `backend/`, `docs/`, `frontend/`.

To see every single file Git would upload, run:

```powershell
git add .
git status
```

Now the files are green. **Look through the list.** You must **NOT** see any of these:

- `backend/filee/.env` or `frontend/filee/.env` (only `.env.example` is OK)
- anything inside `backend/filee/vendor/` or `frontend/filee/node_modules/`
- any file that ends in `.sql`

If you see one of them, **stop**. Run `git reset` to undo `git add .`, and check the `.gitignore` files.

> Tip: the list is long (about 110 files). In VS Code, the **Source Control** panel on the left
> (the icon with three dots and lines) shows the same list in an easier way.

### Step 5. Save the first snapshot (commit)

```powershell
git commit -m "First version of Workspace"
```

**When it works:** you see something like `[main (root-commit) 1a2b3c4] First version of Workspace` and `111 files changed`.

### Step 6. Connect your computer to the GitHub repository

Copy the address from the GitHub page (Part 2, step 7) and use it here:

```powershell
git remote add origin https://github.com/YOUR-NAME/workspace.git
```

(`origin` is the usual nickname for "my repository on GitHub".) Nothing is printed when it works.

### Step 7. Upload (push)

```powershell
git push -u origin main
```

- The first time, a window opens and asks you to **sign in to GitHub**. Sign in, and allow access.
- **When it works**, the last line is like `branch 'main' set up to track 'origin/main'.`

Refresh the GitHub page. You see your files, and GitHub shows `README.md` below them.

### Uploading your changes later

Every time you change something and want to save it on GitHub:

```powershell
git add .
git commit -m "Say in a few words what you changed"
git push
```

---

## Part 4. Check that it still works when someone downloads it

This is how a teacher, a classmate, or you on another computer gets the project from GitHub.

1. Open a terminal in the folder where you want the copy (for example, `Documents`).
2. Download (clone) it:

   ```powershell
   git clone https://github.com/YOUR-NAME/workspace.git workspace-copy
   cd workspace-copy
   ```

3. Follow [02-setup-backend.md](02-setup-backend.md) and [03-setup-frontend.md](03-setup-frontend.md) inside this new folder.
   In short:

   | Folder | Commands |
   |--------|----------|
   | `backend/filee` | `composer install`, copy `.env.example` to `.env`, `php artisan key:generate`, create the database, `php artisan migrate --seed`, `php artisan serve` |
   | `frontend/filee` | `npm install`, copy `.env.example` to `.env`, `npm run dev` |

4. Log in with `officer@example.com` / `password`. You see the sample data.

> **Testing on the SAME computer?** Your real project already uses the database `workspace`.
> So in the copy, give it its own database: in `workspace-copy/backend/filee/.env` set
> `DB_DATABASE=workspace_test`, and create a database with that name.
> Also stop your other servers first, so ports 8000 and 5173 are free.
> When you are done, you can delete the `workspace-copy` folder and the `workspace_test` database.

---

## Part 5. The database, explained

### Where is the database?

The data is **not** inside the project folder. MySQL keeps it in its own folder
(with XAMPP: `C:\xampp\mysql\data\workspace`). Never copy or upload those files by hand.
Use the migrations, seeders, and backups described below.

### Sample data and real data are different

- **Sample data** comes from the seeders (`backend/filee/database/seeders/`). It is fake, so it is fine on GitHub.
  Everyone who downloads the project gets it with `php artisan migrate --seed`.
- **Real data** is what you type into the app: real students, real payments, your own journal entries.
  It stays in YOUR MySQL only.

> **Never upload real data to GitHub**, especially to a public repository.
> Student names, student numbers, and payments are personal information.
> Sharing them can break privacy laws (for example, the Data Privacy Act of 2012 in the Philippines)
> and your school's rules. The top `.gitignore` already blocks `.sql` files to help you.

### When you change the tables

Never edit an old migration. Make a NEW migration (see [08-how-to-add-a-feature.md](08-how-to-add-a-feature.md)),
then commit and push it. Anyone who downloads your new version runs:

```powershell
php artisan migrate
```

Laravel runs only the new migrations, so their existing data stays.

### Back up your real data

Make a backup before big changes, and from time to time (for example, every week).
Save backups **outside** the project folder, or in a private place like your school Google Drive.

**Way A: phpMyAdmin (clicking)**

1. Start **Apache** and **MySQL** in XAMPP, then open http://localhost/phpmyadmin
2. Click **workspace** on the left.
3. Click the **Export** tab at the top.
4. Keep **Quick** and format **SQL**. Click **Export** (or **Go**).
5. Your browser downloads `workspace.sql`. Move it to your backups folder.

**Way B: the command line (typing)**

```powershell
cd $HOME\Documents
New-Item -ItemType Directory -Force workspace-backups
cd workspace-backups
C:\xampp\mysql\bin\mysqldump.exe -u root workspace --result-file=workspace-backup.sql
```

The `New-Item` line prints the new folder's name. The `mysqldump` line prints nothing when it works.
The file `workspace-backup.sql` is now in `Documents\workspace-backups`.

> **Important (Windows PowerShell):** use `--result-file=...` like above.
> Do NOT use `mysqldump ... > workspace-backup.sql` in PowerShell. PowerShell saves the file in a format
> (UTF-16) that MySQL cannot read back.

### Restore a backup, or move your real data to another computer

1. On the other computer, set up the project normally (Part 4), but **skip** `php artisan migrate --seed`.
   The backup already has all the tables and data.
2. Create an empty database named `workspace` (see [02-setup-backend.md](02-setup-backend.md), Step 5).
3. Load the backup into it:

   **Way A: phpMyAdmin.** Click **workspace** on the left, click the **Import** tab,
   click **Choose File**, pick your `.sql` file, then click **Import** (or **Go**).

   **Way B: the command line.** Go to the folder with the backup file, then run:

   ```powershell
   cmd /c "C:\xampp\mysql\bin\mysql.exe -u root workspace < workspace-backup.sql"
   ```

   (PowerShell does not understand `<`, so we ask the old Command Prompt, `cmd`, to run it.)
   Nothing is printed when it works.

4. Log in with your real accounts. Passwords and data work on the new computer.
   You do NOT need the same `APP_KEY` as the old computer.

> **Careful:** importing into a database that already has tables can mix or replace data.
> Import only into an EMPTY database.

---

## Part 6. Can I make it live on the internet?

Not with GitHub alone. A live version of Workspace needs three things:

| Part | What it needs | Can GitHub do it? |
|------|---------------|-------------------|
| React app (`frontend`) | A place that serves plain HTML, CSS, and JavaScript files | Yes, with **GitHub Pages** (free) |
| Laravel API (`backend`) | A server that runs PHP and Composer | **No** |
| MySQL database | A MySQL server on the internet | **No** |

If you put only the React app on GitHub Pages, the login page appears, but every request fails with
"Cannot reach the server", because there is no API behind it.

So a live version needs a **hosting service** that runs Laravel and MySQL. We use **Railway**:
it builds all three parts (MySQL, the Laravel API, and the React app) straight from your GitHub repository,
and updates the website every time you push. It is free for the first 30 days, then about $5 per month.

**Step by step:** [10. Deploy Workspace to a live website (Railway)](10-deploy-to-railway.md)

---

## Checklist

- [ ] GitHub repository created (without a README, .gitignore, or license).
- [ ] `git status` checked: no `.env`, no `vendor`, no `node_modules`, no `.sql` files.
- [ ] First commit made and pushed. The files show on GitHub.
- [ ] (Optional) Cloned into a new folder and tested with guides 02 and 03.
- [ ] Real data backed up OUTSIDE the project folder.
- [ ] Default passwords changed on every computer where real people use the app.
