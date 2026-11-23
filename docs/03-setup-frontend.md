# 03. Set up the frontend (React app)

The frontend is the part you see in the browser. It is written in JavaScript with **React**,
and it runs with a tool called **Vite**.

[Back to README](../README.md) | Before this: [02. Set up the backend](02-setup-backend.md) | Next: [04. Run the app](04-run-the-app.md)

---

## New words

- **React:** a JavaScript library for building pages out of small parts called **components**.
- **npm:** "Node Package Manager". It downloads JavaScript packages. It comes with Node.js.
  The list of packages is in `frontend/package.json`. They are downloaded into `frontend/node_modules`.
- **Vite:** a tool that runs the React app while you work on it. When you save a file, the page updates by itself.
- **Dev server:** "development server". A small server that Vite runs on your computer while you build the app.
- **Environment variable:** a setting that lives outside the code, in a `.env` file.
  In Vite, these names must start with `VITE_`.

---

## Before you start

- `node -v` and `npm -v` print version numbers (see [01-install-tools.md](01-install-tools.md)).
- The backend is set up ([02-setup-backend.md](02-setup-backend.md)).

---

## Step 1. Open a SECOND terminal in the frontend folder

Keep the first terminal (the one running `php artisan serve`) open. You need a new one.

1. In VS Code, click the **+** button in the terminal area (or **Terminal > New Terminal**).
2. Go into the frontend folder:

   ```powershell
   cd frontend
   ```

   If the new terminal opened inside `backend`, go up one folder first: `cd ..\frontend`

3. The line before your cursor now ends with `workspace\frontend>`.

---

## Step 2. Download the npm packages

```powershell
npm install
```

**When it works**, you see something like:

```
added 50 packages, and audited 51 packages in 17s

15 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

A new folder `frontend/node_modules` now exists.

**If it does not work:**

- `'npm' is not recognized`: Node.js is not installed, or the terminal is old. Close it, open a new one.
- `running scripts is disabled on this system`: see
  [07-troubleshooting.md](07-troubleshooting.md#npm-says-running-scripts-is-disabled).

---

## Step 3. Make the frontend .env file (the API address)

React must know where the Laravel API is. That address is in a `.env` file.

**Windows (PowerShell):**

```powershell
Copy-Item .env.example .env
```

**macOS or Linux:**

```bash
cp .env.example .env
```

Open `frontend/.env`. It has one setting:

```
VITE_API_URL=http://127.0.0.1:8000/api
```

- `127.0.0.1` means "this computer".
- `8000` is the port of the Laravel server.
- `/api` is the start of every API address.

If you started Laravel on another port (for example `php artisan serve --port=8001`),
change the number here too.

> **Important:** Vite reads `.env` only when it starts. If you change `.env`,
> stop Vite (**Ctrl + C**) and start it again (Step 4).

---

## Step 4. Start the dev server

```powershell
npm run dev
```

**When it works:**

```
  VITE v8.3.8  ready in 663 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Leave this terminal open.** The React app only works while this command runs.

Hold **Ctrl** and click the `http://localhost:5173/` link, or type it in your browser.
You should see the **Workspace** login box.

**To stop the dev server:** click in the terminal and press **Ctrl + C**.

---

## Done?

You now have two terminals running:

| Terminal | Folder | Command | Address |
|----------|--------|---------|---------|
| 1 | `backend` | `php artisan serve` | http://127.0.0.1:8000 |
| 2 | `frontend` | `npm run dev` | http://localhost:5173 |

Go to [04. Run the app](04-run-the-app.md) to log in and look around.
