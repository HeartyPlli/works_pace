# 10. Deploy Workspace to a live website (Railway)

This tutorial takes you from **code on GitHub** to **a real website** that you (and anyone you share the link with)
can open from any phone or computer. We use **Railway**, a hosting service that builds your app straight from GitHub.

At the end you will have two web addresses like these:

- `https://frontend-production-1234.up.railway.app` : the website (the React app). **This is the one you visit.**
- `https://backend-production-5678.up.railway.app` : the Laravel API that the website talks to.

[Back to README](../README.md) | Before this: [09. Put it on GitHub](09-put-it-on-github.md)

---

## Read this first: the cost

Prices were checked on **November 24, 2026**. Always check https://railway.com/pricing before you start, because prices can change.

| Railway plan | Price | Good for this app? |
|--------------|-------|--------------------|
| **Free Trial** | $0. You get a one-time $5 credit that lasts 30 days. No credit card needed. | **Yes, for about a month.** Perfect for a class demo or to learn. When the credit runs out, Railway stops your app. |
| Free | $0 with $1 of usage per month. Apps sleep when nobody uses them. | No. $1 is not enough, and Railway says databases start on Hobby. |
| **Hobby** | $5 per month, which includes $5 of usage. | **Yes.** A small app like this one usually costs about the included $5, sometimes a little more. |

Railway charges for what your app uses (mostly memory: about $10 per GB per month).
You can always see the current cost on the **Usage** page of your Railway account.

**To stop paying later:** delete the project (see [Part 9](#part-9-stop-or-delete-the-website)).

---

## New words

- **Deploy:** copy your app to a computer on the internet (a **server**) and start it there.
- **Hosting service:** a company that rents you servers. Railway is one.
- **Project (Railway):** a box that holds all the parts of one app.
- **Service (Railway):** one running part of your app. We will make **three**: `MySQL`, `backend`, and `frontend`.
- **Build:** Railway turns your code into something that can run (it runs `composer install` or `npm run build` for you).
- **Variables (Railway):** the settings of a service. They do the same job as your `.env` file, but on the server.
- **Domain:** the web address of a service, like `something.up.railway.app`.
- **Root Directory:** which folder of your GitHub repository a service uses (`/backend` or `/frontend`).
- **Pre-deploy command:** a command Railway runs before it starts a new version of your app (we use it to make the tables).
- **Production:** the live version that real people use. On your computer you have the **local** version.
- **Logs:** the text a server prints while it works. Errors show up here.

---

## How the pieces fit together

```
           your browser
               |
               v
   frontend  (React app, files only)  https://frontend-....up.railway.app
               |
               |  axios requests to VITE_API_URL
               v
   backend   (Laravel API)            https://backend-....up.railway.app/api
               |
               |  private network inside Railway (DB_URL)
               v
   MySQL     (the live database)      not on the internet, only the backend can reach it
```

This is the same as on your computer. Only the addresses change:

| Setting | On your computer | On Railway |
|---------|------------------|------------|
| API address (`VITE_API_URL`) | `http://127.0.0.1:8000/api` | `https://` + the backend's domain + `/api` |
| Database | XAMPP MySQL, database `workspace` | Railway's MySQL service |
| Settings | `.env` files | the **Variables** tab of each service |

---

## Part 0. Before you start

You need:

- [ ] Your project on GitHub ([09-put-it-on-github.md](09-put-it-on-github.md)).
- [ ] Your **latest** code pushed. This tutorial needs the newest versions of these files:
      `backend/database/seeders/UserSeeder.php`, `backend/database/seeders/DatabaseSeeder.php`,
      `backend/config/cors.php`, and `backend/composer.json`. To be sure, run in the top `workspace` folder:

  ```powershell
  git add .
  git commit -m "Get ready to deploy"
  git push
  ```

  If `git commit` says `nothing to commit, working tree clean`, that is fine. Still run `git push`.
  If it says `Everything up-to-date`, GitHub already has your latest code.

- [ ] Two **strong passwords** written down somewhere safe: one for the officer account and one for the viewer account.
      (At least 12 characters. Do not use "password".)
- [ ] An **app key** for the live server. In the `backend` folder, run:

  ```powershell
  php artisan key:generate --show
  ```

  It prints one line that starts with `base64:` (about 51 characters). Copy the whole line, including `base64:`.
  This command only shows a key. It does **not** change your own `.env`.

---

## Part 1. Make a Railway account

1. Go to https://railway.com and click **Sign in** (or **Start a New Project**).
2. Choose **Sign in with GitHub**. Use the same GitHub account that has your `workspace` repository.
3. Accept Railway's terms if it asks. You are now on the free trial. No credit card is needed.

---

## Part 2. Make a project with a MySQL database

1. On the Railway dashboard, click **New Project** (or **+ New**).
2. Choose **Database**, then **MySQL** (Railway may call it "Deploy MySQL").
3. Wait about a minute. A box named **MySQL** appears on the project page (Railway calls this page the "canvas").
   When it shows that it is running (a green dot or "Active"), the database is ready.

> Keep the name **MySQL** exactly like that (capital M, S, Q, L). Part 3 uses this name to find the database.
> If your box has a different name, use that name instead in Part 3.

Railway made the database **and** its settings for you (user, password, address).
You do not need to create a database by hand like you did with XAMPP.

---

## Part 3. Add the backend (Laravel API)

### Step 1. Connect your GitHub repository

1. On the project page, click **+ New** (or **Create**), then **GitHub Repo**.
2. The first time, Railway asks to connect to GitHub. Choose **Only select repositories**, pick **workspace**, and save.
3. Pick your **workspace** repository from the list.
4. A new box appears and Railway starts to build it right away.
   **This first build will probably fail.** That is normal: Railway is looking at the top folder, but the
   Laravel app is inside `backend`. We fix that in the next step.

### Step 2. Name it and point it to the backend folder

1. Click the new box, then open the **Settings** tab.
2. At the top, change the service name to **backend** (all small letters). Part 5 uses this name.
3. Find **Root Directory** (in the **Source** section) and type:

   ```
   /backend
   ```

4. Find **Pre-deploy Command** (in the **Deploy** section; you may need to click **Add pre-deploy step**) and type:

   ```
   php artisan migrate --force && php artisan db:seed --force
   ```

   - `migrate --force` makes the tables. (`--force` is needed on a live server; it means "yes, I am sure".)
   - `db:seed --force` makes the two accounts and the sample data. It is safe to run on every deploy:
     when the accounts already exist, it skips itself and does nothing.

### Step 3. Add the variables

1. Open the **Variables** tab of the **backend** box.
2. Click **Raw Editor** (it lets you paste many variables at once).
3. Paste this, then change the three lines marked below:

   ```
   APP_NAME=Workspace
   APP_ENV=production
   APP_DEBUG=false
   APP_KEY=paste-the-key-from-part-0-here
   DB_CONNECTION=mysql
   DB_URL=${{MySQL.MYSQL_URL}}
   LOG_CHANNEL=stderr
   OFFICER_PASSWORD=type-your-strong-officer-password
   VIEWER_PASSWORD=type-your-strong-viewer-password
   ```

   - **APP_KEY:** paste the whole `base64:...` line from Part 0.
   - **OFFICER_PASSWORD** and **VIEWER_PASSWORD:** your two strong passwords.
   - Do not change `${{MySQL.MYSQL_URL}}`. Railway replaces it with the real database address and password for you.
     (If your database box has another name, use that name instead of `MySQL`.)

4. Click **Update Variables** (or **Save**).

**What each variable does:**

| Variable | What it does |
|----------|--------------|
| `APP_ENV=production` | Tells Laravel this is the live website. |
| `APP_DEBUG=false` | Hides error details from visitors. **Never set it to true on a live website.** |
| `APP_KEY` | The secret key Laravel uses to protect data. |
| `DB_CONNECTION` and `DB_URL` | Connect to the MySQL service. `DB_URL` holds the address, user, and password in one line. |
| `LOG_CHANNEL=stderr` | Sends Laravel's errors to Railway's logs, so you can read them. |
| `OFFICER_PASSWORD`, `VIEWER_PASSWORD` | The passwords of the two accounts, used once when the accounts are made. If they are missing, the seeder stops with an error on purpose, so the website never gets the easy password "password". |

> **Want the live website to start EMPTY** (no fake students, resolutions, or journal entries)?
> Also add `SEED_SAMPLE_DATA=false`. Keep the sample data if the site is only a demo.
> Decide **before** the first successful deploy: the seeder runs only once.

### Step 4. Deploy and give it a web address

1. Railway shows a bar at the top with your changes and a **Deploy** button (sometimes **Apply changes**). Click it.
2. Open the **Deployments** tab and watch. The build takes a few minutes the first time.
   - **Build:** Railway sees `composer.json` and `artisan`, so it knows this is a Laravel app. It installs PHP and runs `composer install`.
   - **Pre-deploy:** it runs your migrate and seed command.
   - **Deploy:** it starts the app.
3. When the newest deployment says **Success** (or **Active**), go to **Settings**, then **Networking**,
   and click **Generate Domain**. If Railway asks for a port, choose the one it suggests (often `8080`).
4. You get an address like `backend-production-5678.up.railway.app`. Click it.

**When it works,** the page shows:

```
{"message":"The Workspace API is running. Open the React app to use it."}
```

Also try the address with `/api/me` at the end. You should see `{"message":"Unauthenticated."}`.
That is correct: the API works, and you are not logged in.

**If it did not work:** open **Deployments**, click the newest one, and read **Build Logs** and **Deploy Logs**.
Then see [Part 8. Troubleshooting](#part-8-troubleshooting).

---

## Part 4. Check the live database (optional)

1. Click the **MySQL** box, then the **Data** tab.
2. You see the tables: `users`, `students`, `resolutions`, and the rest.
3. Click `users`: there are 2 rows. The passwords are long scrambled text (hashes). That is correct.

This live database is **separate** from the `workspace` database on your computer.
Changes on the website do not change your computer, and the other way around.

---

## Part 5. Add the frontend (React app)

### Step 1. Add the same repository again

1. On the project page, click **+ New**, then **GitHub Repo**, and pick **workspace** again.
   (Yes, the same repository. This time we use its `frontend` folder.)
2. Again, the first build may fail. That is fine.

### Step 2. Name it and point it to the frontend folder

1. Click the new box, open **Settings**.
2. Change the service name to **frontend**.
3. Set **Root Directory** to:

   ```
   /frontend
   ```

   (No pre-deploy command is needed here.)

### Step 3. Tell it where the API is

1. Open the **Variables** tab of the **frontend** box, and add this one variable:

   ```
   VITE_API_URL=https://${{backend.RAILWAY_PUBLIC_DOMAIN}}/api
   ```

   `${{backend.RAILWAY_PUBLIC_DOMAIN}}` means "the web address of the service named backend".
   Railway fills it in for you, so you do not have to copy the address by hand.

2. Click **Deploy** in the changes bar.

> **Why the backend needed its address first:** `VITE_API_URL` is baked into the website files
> when Railway runs `npm run build`. If the backend had no address yet, the website would call an empty address.

**What Railway does with this folder:** it sees Vite, runs `npm install` and `npm run build`,
and serves the `dist` folder with a small web server (Caddy). It also sends every unknown address
to `index.html`, so refreshing a page like `/students` works.

### Step 4. Give it a web address

1. When the deployment says **Success**, go to **Settings**, then **Networking**, and click **Generate Domain**.
   If it asks for a port, choose the suggested one.
2. You get an address like `frontend-production-1234.up.railway.app`.

**This is your website.** Open it. You see the **Workspace** login box.

---

## Part 6. Log in and test

1. Log in with `officer@example.com` and **your OFFICER_PASSWORD** (not "password").
2. You see the Dashboard. With sample data: **PHP 1,800.00** collected and **PHP 1,325.00** unpaid.
3. Try a few things: add a student, record a payment, open a resolution's print page, add a journal entry.
4. Open the **Students** page and press **F5** to refresh. The page must load again (not a 404 error).
5. Open the website on your **phone**. It works there too.
6. Log out and log in as `viewer@example.com` with your VIEWER_PASSWORD. The Add, Edit, and Delete buttons are gone.

**Share the frontend address** (the one from Part 5) with your teacher or classmates.
They log in with the accounts and passwords you give them.

> The login emails are still `officer@example.com` and `viewer@example.com`. That is fine for a demo.
> Anyone who knows an email still needs the password, so keep the passwords private.

---

## Part 7. Extra safety: allow only your website to call the API

Right now the API answers requests from any website (`*`). Since you know your website's address now,
you can allow only that one:

1. Open the **backend** box, then **Variables**, and add:

   ```
   FRONTEND_URL=https://${{frontend.RAILWAY_PUBLIC_DOMAIN}}
   ```

2. Click **Deploy**.
3. Open your website again and log in. It still works.

If the website suddenly shows a CORS error in the browser console (F12), delete the `FRONTEND_URL`
variable and deploy again. Then the API allows every origin again.

---

## Updating the website later

You do not need to do anything on Railway. Just push to GitHub:

```powershell
git add .
git commit -m "Say what you changed"
git push
```

Railway sees the new commit and builds both services again (a few minutes). Your live data stays.
New migrations (for example from [08-how-to-add-a-feature.md](08-how-to-add-a-feature.md)) run by themselves,
because of the pre-deploy command. The seeder skips itself, because the accounts already exist.

> Tip: always test a change on your computer first. If a broken version reaches GitHub, Railway keeps the
> old working version online when the new build fails.

---

## Part 8. Troubleshooting

First, find the error: click the service box, open **Deployments**, click the newest deployment,
and read the **Build Logs** (problems while building) or **Deploy Logs** (problems while running).
For the website, also press **F12** in the browser and look at the **Console** tab.

| What you see | Why | Fix |
|--------------|-----|-----|
| The build fails right after you add the repo | The Root Directory is not set yet | Set it to `/backend` or `/frontend` (Part 3 Step 2, Part 5 Step 2), then deploy. |
| Pre-deploy fails with `Set OFFICER_PASSWORD and VIEWER_PASSWORD before seeding a live website` | The password variables are missing | Add both variables to the **backend** (Part 3 Step 3), then deploy. |
| `could not find driver` in the logs | PHP's MySQL driver is missing | Add the backend variable `RAILPACK_PHP_EXTENSIONS=pdo_mysql`, then deploy. |
| `SQLSTATE[HY000] [2002]` or `getaddrinfo failed` | The backend cannot find the database | Check that `DB_URL` is exactly `${{MySQL.MYSQL_URL}}` and that the database box is named `MySQL` and is running. |
| `No application encryption key has been specified` | `APP_KEY` is missing or cut off | Paste the full `base64:...` line again (Part 0). |
| The backend address says "Application failed to respond" | Wrong port, or the app crashed | Read the Deploy Logs. In **Settings > Networking**, check the port matches the one in the logs. |
| The website says "Cannot reach the server. Is the Laravel server running?" | `VITE_API_URL` is wrong, or the backend is down | Open the backend address: does it show the "API is running" message? Check the frontend variable (Part 5 Step 3). Then deploy the frontend again. |
| Login works on your computer, but the website says "Wrong email or password." | The live accounts use your **new** passwords | Use OFFICER_PASSWORD / VIEWER_PASSWORD, not "password". |
| CORS error in the browser console | `FRONTEND_URL` does not match the website's address | Delete `FRONTEND_URL` from the backend variables and deploy (Part 7). |
| Refreshing `/students` shows a 404 page | The web server did not set up page routing | Add the frontend variable `RAILPACK_SPA_OUTPUT_DIR=dist`, then deploy the frontend again. |
| The website stopped working after a few weeks | The trial credit ran out, so Railway stopped the app | Upgrade to **Hobby** in your Railway account, then deploy again. |
| You changed the passwords in the variables, but the old passwords still work | The seeder only runs once, when the accounts are first made | See below. |

**Changing a password after the first deploy:** the `OFFICER_PASSWORD` and `VIEWER_PASSWORD` variables are only used
the first time the accounts are made. To change a password later, you need a terminal on the server.
Install the Railway CLI (https://docs.railway.com/guides/cli), then in your `workspace` folder run
`railway login`, `railway link` (pick your project and the **backend** service), and `railway ssh`.
On the server, use `php artisan tinker` exactly like in
[06-manual-steps-checklist.md](06-manual-steps-checklist.md#e-change-the-default-passwords-before-real-people-use-the-app), part E.

---

## Part 9. Stop or delete the website

- **Pause one service:** open its **Deployments** tab, click the menu (three dots) of the active deployment,
  and choose **Remove**. To start it again later, click **Redeploy** on a deployment, or push a new commit.
- **Delete everything** (stops all costs): open the project, go to **Settings** (project settings),
  find the **Danger** section, and delete the project. **This deletes the live database too.** It cannot be undone.

Your code on GitHub and your computer is not touched. You can deploy again any time by following this guide.

---

## Checklist

- [ ] Latest code pushed to GitHub.
- [ ] App key made with `php artisan key:generate --show`.
- [ ] Two strong passwords chosen and kept private.
- [ ] Railway project with a **MySQL** service.
- [ ] **backend** service: Root Directory `/backend`, pre-deploy command, variables, domain. The address shows "The Workspace API is running".
- [ ] **frontend** service: Root Directory `/frontend`, `VITE_API_URL`, domain. The address shows the login box.
- [ ] Logged in with the new officer password. Refreshing `/students` works.
- [ ] (Optional) `FRONTEND_URL` set on the backend.
- [ ] You know where to see the cost (**Usage** page) and how to delete the project.
