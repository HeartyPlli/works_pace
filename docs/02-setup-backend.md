# 02. Set up the backend (Laravel API)

The backend is the part of the app that keeps the data. It is written in PHP with **Laravel**.
In this guide you download its packages, connect it to a database, make the tables, and start it.

[Back to README](../README.md) | Before this: [01. Install the tools](01-install-tools.md) | Next: [03. Set up the frontend](03-setup-frontend.md)

---

## New words

- **API:** "Application Programming Interface". Here it means a list of web addresses (like `/api/students`)
  that send and receive data instead of web pages. React calls these addresses to get data.
- **Laravel:** a PHP "framework", a big set of ready made code for building web apps.
- **Composer:** the tool that downloads PHP packages. The list of packages is in `backend/filee/composer.json`.
  The downloaded packages go into the `backend/filee/vendor` folder.
- **Database:** a program that stores data in tables (like spreadsheets). We use **MySQL**.
- **.env file:** a small text file with settings for YOUR computer (database name, password, and so on).
  Every computer has its own `.env`, so it is not shared or saved in Git.
- **artisan:** Laravel's helper program. You run it with `php artisan something`.
- **Migration:** a PHP file that creates or changes a database table. Running the migrations builds all the tables.
- **Seeder:** a PHP file that puts starting data into the tables (like the two login accounts).
- **Server:** a program that waits for requests and answers them.
- **Port:** a number that tells which program on your computer should get a request.
  Laravel uses port **8000**, React uses port **5173**, and MySQL uses port **3306**.

---

## Before you start

- MySQL is running (XAMPP Control Panel: **MySQL** is green).
- `php -v` and `composer --version` print version numbers (see [01-install-tools.md](01-install-tools.md)).

---

## Step 1. Open a terminal in the backend/filee folder

1. Open the `workspace` folder in VS Code (**File > Open Folder...**).
2. Open the terminal (**Terminal > New Terminal**, or **Ctrl + `**).
3. Go into the `backend/filee` folder (it holds all the Laravel files). Type this and press **Enter**:

   ```powershell
   cd backend\filee
   ```

   (`cd` means "change directory", which means "go into this folder". `backend\filee` means "the `filee` folder inside `backend`".)

4. The line before your cursor now ends with `workspace\backend\filee>`. All the commands in this guide are typed here.

---

## Step 2. Download the Laravel packages

```powershell
composer install
```

This can take a few minutes the first time. Many lines scroll by.

**When it works**, the last lines look like this:

```
   INFO  Discovering packages.

  laravel/pail ............................................ DONE
  laravel/sail ............................................ DONE
  laravel/sanctum ......................................... DONE
  ...
```

A new folder `backend/filee/vendor` now exists.

**If it does not work:**

- `'composer' is not recognized`: Composer is not installed, or the terminal is old. Close it, open a new one, try again.
- `The zip extension and unzip/7z commands are both missing`: turn on `extension=zip` in `php.ini`
  (see [01-install-tools.md](01-install-tools.md#step-1-install-xampp-php--mysql--phpmyadmin)).
- More help: [07-troubleshooting.md](07-troubleshooting.md).

---

## Step 3. Make your .env file

The project comes with an example file named `.env.example`. Copy it and name the copy `.env`.

**Windows (PowerShell):**

```powershell
Copy-Item .env.example .env
```

**macOS or Linux:**

```bash
cp .env.example .env
```

Nothing is printed when it works. You can see the new `.env` file in the VS Code file list.

> If a `.env` file is already there, skip this step. Copying again would replace your settings.

---

## Step 4. Make the app key

Laravel needs a secret key to protect data. This command makes one and writes it into `.env`:

```powershell
php artisan key:generate
```

**When it works:**

```
   INFO  Application key set successfully.
```

Open `.env`. The line `APP_KEY=` now has a long value that starts with `base64:`.

---

## Step 5. Create the database (by hand)

Laravel can make the tables, but first you must make an empty database named **workspace**.
Choose **one** of these two ways.

### Way A: with phpMyAdmin (clicking)

1. In the XAMPP Control Panel, start **Apache** and **MySQL**.
2. In your browser, open http://localhost/phpmyadmin
3. On the left, click **New**.
4. In "Database name", type `workspace`
5. In the list next to it, choose `utf8mb4_unicode_ci`
6. Click **Create**.
7. `workspace` now shows in the list on the left. It is empty. That is correct.

### Way B: with the command line (typing)

1. Open the MySQL command line. On Windows with XAMPP:

   ```powershell
   C:\xampp\mysql\bin\mysql.exe -u root -p
   ```

   On macOS or Linux: `mysql -u root -p`

2. It asks `Enter password:`. With XAMPP or Laragon, just press **Enter** (the password is empty).
3. You see a prompt like `MariaDB [(none)]>` or `mysql>`. Type this and press **Enter**:

   ```sql
   CREATE DATABASE workspace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

4. **When it works:** `Query OK, 1 row affected`
5. Type `EXIT;` and press **Enter** to leave.

---

## Step 6. Check the database values in .env

Open `backend/filee/.env` in VS Code and find these lines:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=workspace
DB_USERNAME=root
DB_PASSWORD=
```

- With **XAMPP or Laragon**, these values are already right. Do not change anything.
- If your MySQL user has a password, type it after `DB_PASSWORD=` (no spaces, no quotes needed).
- If you made another user (Linux), change `DB_USERNAME` and `DB_PASSWORD`.

Save the file (**Ctrl + S**).

---

## Step 7. Make the tables (run the migrations)

```powershell
php artisan migrate
```

**When it works:**

```
   INFO  Preparing database.

  Creating migration table ............................... DONE

   INFO  Running migrations.

  0001_01_01_000000_create_users_table ................... DONE
  2026_01_01_000001_create_resolutions_table ............. DONE
  2026_01_01_000002_create_students_table ................ DONE
  2026_01_01_000003_create_charges_table ................. DONE
  2026_01_01_000004_create_student_charges_table ......... DONE
  2026_01_01_000005_create_payments_table ................ DONE
  2026_01_01_000006_create_error_entries_table ........... DONE
  2026_01_01_000007_create_tags_table .................... DONE
  2026_01_01_000008_create_error_entry_tag_table ......... DONE
  2026_11_23_192346_create_personal_access_tokens_table .. DONE
```

(Your last file may have a different date. That is fine. It is the table for login tokens.)

**If it does not work:**

- `SQLSTATE[HY000] [2002] ... actively refused it`: MySQL is not running. Start it in XAMPP.
- `Unknown database 'workspace'`: you skipped Step 5. Laravel may also ask
  `Would you like to create it? (yes/no)`. Type `yes` and press **Enter**. That works too.
- `Access denied for user 'root'`: the password in `.env` is wrong (Step 6).

---

## Step 8. Put in the starting data (run the seeders)

```powershell
php artisan db:seed
```

**When it works:**

```
   INFO  Seeding database.

  Database\Seeders\UserSeeder ........................... RUNNING
  Database\Seeders\UserSeeder ........................... DONE
  Database\Seeders\StudentSeeder ........................ DONE
  Database\Seeders\ResolutionSeeder ..................... DONE
  Database\Seeders\ChargeSeeder ......................... DONE
  Database\Seeders\JournalSeeder ........................ DONE
```

You now have:

- 2 login accounts (`officer@example.com` and `viewer@example.com`, password `password`)
- 20 students, 5 resolutions, 2 charges, 17 payments
- 10 Error Fix Journal entries with 11 tags

> **Running `db:seed` again is safe.** When the accounts already exist, it only prints
> `The database already has accounts, so seeding is skipped.` and adds nothing.
>
> **Optional:** to choose your own passwords instead of `password`, open `backend/filee/.env` BEFORE you seed,
> remove the `#` in front of `OFFICER_PASSWORD` and `VIEWER_PASSWORD`, and type your passwords there.
> To start with no sample data at all, also remove the `#` in front of `SEED_SAMPLE_DATA=false`.

**Tip: start over with fresh data.** This command deletes ALL tables and data, makes them again, and seeds them:

```powershell
php artisan migrate:fresh --seed
```

Use it when your test data gets messy. Never use it on a database with real data you want to keep.

---

## Step 9. Start the API server

```powershell
php artisan serve
```

**When it works:**

```
   INFO  Server running on [http://127.0.0.1:8000].

  Press Ctrl+C to stop the server
```

**Leave this terminal open.** The API only works while this command runs.

Check it: open http://127.0.0.1:8000 in your browser. You should see:

```
{"message":"The Workspace API is running. Open the React app to use it."}
```

You can also open http://127.0.0.1:8000/api/me. You should see `{"message":"Unauthenticated."}`.
That is correct: the API is working, and it tells you that you have not logged in.

**To stop the server:** click in the terminal and press **Ctrl + C**.

**If port 8000 is busy:** see [07-troubleshooting.md](07-troubleshooting.md#port-is-already-in-use).

---

## Done?

The API is running at http://127.0.0.1:8000. Keep that terminal open and go to
[03. Set up the frontend](03-setup-frontend.md).
