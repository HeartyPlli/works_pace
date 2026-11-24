# 05. How the code works

This guide explains the folders and the most important files in plain words.
Then it follows ONE full example, clicking **Login**, from the button all the way to the database and back.

[Back to README](../README.md) | Before this: [04. Run the app](04-run-the-app.md) | Next: [06. Manual steps checklist](06-manual-steps-checklist.md)

---

## New words

- **Request:** a message from the browser to a server, like "give me the list of students".
- **Response:** the server's answer.
- **JSON:** a simple text format for data, like `{"name": "Maria", "year_level": 1}`. The API sends and receives JSON.
- **HTTP method:** the kind of request. `GET` reads data, `POST` adds, `PUT` changes, `DELETE` removes.
- **Status code:** a number in every response. `200` OK, `201` created, `401` not logged in,
  `403` not allowed, `404` not found, `422` the form has mistakes.
- **Token:** a long secret text that proves you are logged in, like a wristband at an event.
  You get it when you log in. You show it with every request.
- **Component:** a JavaScript function that returns a piece of the page (React).
- **State:** a value that a component remembers, made with `useState`. When state changes, React draws the page again.
- **Model:** a PHP class that stands for one database table (Laravel). `Student` stands for the `students` table.
- **Controller:** a PHP class with the code that answers requests (Laravel).
- **Middleware:** code that runs before the controller, like a guard at a door.

---

## The big picture

```
 Browser (React app)          Laravel API                   MySQL database
 http://localhost:5173        http://127.0.0.1:8000/api     database "workspace"

  LoginPage.jsx   ---POST /api/login--->  routes/api.php
                                          AuthController  ---SELECT---> users table
                                                          ---INSERT---> personal_access_tokens
                  <---JSON {token,user}--
  DashboardPage   ---GET /api/dashboard-> (token checked)
                  (with the token)        DashboardController --SELECT--> payments, resolutions...
                  <---JSON {totals...}---
```

1. React shows the pages and sends **requests** with axios.
2. Laravel finds the right **route**, runs the **controller**, and talks to the **database** through **models**.
3. Laravel sends back **JSON**. React puts the data in **state**, and the page updates.

---

## The backend folder (Laravel)

All the backend files are in `backend/filee`. The paths below start from there
(so `routes/api.php` means `backend/filee/routes/api.php`).

Only the files we wrote or changed are listed. The rest is normal Laravel.

| Path | What it is |
|------|------------|
| `routes/api.php` | The list of all API addresses, and which controller method answers each one. **Start reading here.** |
| `app/Http/Controllers/` | One controller per topic. Each method answers one route. |
| `app/Http/Middleware/OfficerOnly.php` | The guard that lets only officers change data. |
| `app/Models/` | One model per table, with the relationships (for example, a `Student` has many `StudentCharge`). |
| `database/migrations/` | The files that create the tables. |
| `database/seeders/` | The files that put starting data in the tables. |
| `bootstrap/app.php` | Starts Laravel: loads the route files, names our middleware `officer`, and sends API errors as JSON. |
| `config/cors.php` | CORS settings (which websites may call the API). |
| `.env` | Your computer's settings (database name and password). |

**The controllers:**

| Controller | Routes it answers |
|------------|-------------------|
| `AuthController` | `POST /login`, `POST /logout`, `GET /me` |
| `DashboardController` | `GET /dashboard` |
| `ResolutionController` | `/resolutions` (list, add, show, edit, delete) and `/resolutions/next-number` |
| `StudentController` | `/students` (list, add, edit, delete) and `/students/{id}/ledger` |
| `ChargeController` | `GET /charges`, `POST /charges` |
| `StudentChargeController` | `POST /student-charges` (give a charge to one or many students) |
| `PaymentController` | `POST /payments` |
| `ReportController` | `GET /reports/unpaid` |
| `ErrorEntryController` | `/entries` (list, add, show, edit, delete), `/entries/{id}/seen`, `/entries/{id}/favorite` |
| `TagController` | `GET /tags` |

**The tables and how they connect:**

```
users ──< resolutions (created_by)
resolutions ──< charges (resolution_id, can be empty)
students ──< student_charges >── charges
student_charges ──< payments (received_by is a user)
users ──< error_entries >──< tags   (through the error_entry_tag table)
```

`──<` means "one to many". For example, one student has many student charges.
**Balance of a student charge** = `amount_due` minus all its payments. See `balance()` in `app/Models/StudentCharge.php`.

---

## The frontend folder (React)

All the frontend files are in `frontend/filee`. The paths below start from there
(so `src/App.jsx` means `frontend/filee/src/App.jsx`).

| Path | What it is |
|------|------------|
| `src/main.jsx` | The starting point. It shows `App` inside `index.html`. |
| `src/App.jsx` | The list of pages (routes), like `/students` shows `StudentsPage`. |
| `src/index.css` | All the styles in one file. |
| `src/api/client.js` | The ONE axios object. It knows the API address and adds the token to every request. |
| `src/api/authApi.js`, `dashboardApi.js`, `councilApi.js`, `journalApi.js` | Small functions that call the API, like `getStudents()`. |
| `src/components/AuthContext.jsx` | Remembers who is logged in. Has `login()` and `logout()`. Any component can call `useAuth()`. |
| `src/components/ProtectedRoute.jsx` | Sends visitors who are not logged in to `/login`. |
| `src/components/` (the rest) | Parts that many pages share: `Layout`, `Sidebar`, `Topbar`, `SearchBar`, `Modal`, `DataTable`, `CodeBox`. |
| `src/pages/` | One file per screen, plus the small forms the screens open in a pop up (like `StudentForm.jsx`). |
| `src/helpers.js` | Small helpers: `formatMoney(150)` gives `PHP 150.00`, `formatResolutionNumber(4, 2026)`, dates, and `getErrorMessage(error)`, which turns an API error into a short message for the screen. |
| `.env` | `VITE_API_URL`, the address of the API. |

**The pages, by module:**

| Module | Files in `src/pages/` |
|--------|------------------------|
| Login and home | `LoginPage`, `DashboardPage` |
| Council | `ResolutionsPage`, `ResolutionFormPage`, `ResolutionPrintPage`, `StudentsPage`, `StudentForm`, `StudentLedgerPage`, `PaymentForm`, `ChargesPage`, `ChargeForm`, `AssignChargeForm`, `UnpaidReportPage` |
| Error Fix Journal | `EntriesPage`, `EntryCard`, `EntryDetailPage`, `EntryFormPage` |

**How a page loads data (the same pattern in every page):**

```jsx
const [students, setStudents] = useState([]);   // 1. a place to keep the data

useEffect(() => {                                // 2. when the page opens...
  loadStudents();
}, []);

async function loadStudents() {
  const data = await getStudents(search);       // 3. ...ask the API
  setStudents(data);                            // 4. save it, and React draws the table
}
```

---

## One full example: clicking Login

Let us follow what happens when you type `officer@example.com` and `password` and click **Login**.

### Step 1. The form (React): `frontend/filee/src/pages/LoginPage.jsx`

Each input box is connected to a piece of state (`email` and `password`).
When you click **Login**, the form runs `handleSubmit`:

```jsx
async function handleSubmit(event) {
  event.preventDefault();            // stop the browser from reloading the page
  setErrorMessage('');
  setSaving(true);                   // the button now says "Logging in..."
  try {
    await login(email, password);    // go to Step 2
    navigate('/');                   // Step 9: go to the dashboard
  } catch (error) {
    setErrorMessage(getErrorMessage(error));   // show "Wrong email or password."
    setSaving(false);
  }
}
```

`login` comes from `useAuth()`, so the next step is in AuthContext.

### Step 2. The login function (React): `frontend/filee/src/components/AuthContext.jsx`

```jsx
async function login(email, password) {
  const data = await loginRequest(email, password);   // go to Step 3
  localStorage.setItem('token', data.token);          // Step 8: save the token
  setUser(data.user);                                 // Step 8: remember the user
}
```

### Step 3. The API function (React): `frontend/filee/src/api/authApi.js`

```js
export async function loginRequest(email, password) {
  const response = await apiClient.post('/login', { email: email, password: password });
  return response.data;
}
```

`apiClient.post('/login', ...)` means "send a POST request to `/login` with this data as JSON".

### Step 4. axios sends the request: `frontend/filee/src/api/client.js`

```js
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  headers: { Accept: 'application/json' },
});
```

- `baseURL` comes from `frontend/filee/.env`. So `/login` becomes `http://127.0.0.1:8000/api/login`.
- `Accept: application/json` tells Laravel "please answer in JSON".
- Before every request, an "interceptor" adds the saved token as `Authorization: Bearer <token>`.
  At login we do not have a token yet, so nothing is added.

Because React (port 5173) calls a different address (port 8000), the browser first asks Laravel
"may this website call you?" This is **CORS**. Laravel answers "yes" using `backend/filee/config/cors.php`.

The request that leaves the browser looks like this:

```
POST http://127.0.0.1:8000/api/login
Accept: application/json
Content-Type: application/json

{"email":"officer@example.com","password":"password"}
```

### Step 5. Laravel finds the route: `backend/filee/routes/api.php`

```php
Route::post('/login', [AuthController::class, 'login']);
```

This line means: "a POST to `/api/login` is answered by the `login` method of `AuthController`".
Laravel adds `/api` in front of every route in this file.
This route is outside the `auth:sanctum` group, so no token is needed.

### Step 6. The controller checks the password: `backend/filee/app/Http/Controllers/AuthController.php`

```php
public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if ($user === null || ! Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Wrong email or password.'], 422);
    }

    $token = $user->createToken('workspace-login')->plainTextToken;

    return response()->json([
        'message' => 'Logged in.',
        'token' => $token,
        'user' => $user,
    ]);
}
```

Line by line:

1. `validate(...)`: if the email or password is missing, Laravel stops here and sends back a `422` with messages like
   "The email field is required."
2. `User::where('email', ...)->first()`: find the user with this email.
3. `Hash::check(...)`: passwords are never saved as plain text. The database keeps a scrambled version (a "hash").
   `Hash::check` scrambles what you typed the same way and compares.
4. If the user is missing or the password is wrong, send `422` with "Wrong email or password."
5. `createToken(...)`: make a new token (this comes from **Laravel Sanctum**, through `HasApiTokens` in `app/Models/User.php`).
6. Send back JSON with the token and the user.

### Step 7. The database (MySQL)

Two things happen in the database during Step 6:

- `User::where('email', ...)->first()` becomes this SQL:
  `select * from users where email = 'officer@example.com' limit 1`
- `createToken(...)` adds a row to the `personal_access_tokens` table.
  The table keeps only a hash of the token, so even someone who reads the database cannot use it.
  The real token (like `1|aBcD1234...`) is sent to you only once, in the response.

The answer that goes back to the browser:

```json
{
  "message": "Logged in.",
  "token": "1|aBcD1234exampleOnlyThisIsAboutFortyEightLetters00",
  "user": { "id": 1, "name": "Council Officer", "email": "officer@example.com", "role": "officer" }
}
```

(The password is not in the answer, because the `User` model lists it in `$hidden`.)

### Step 8. React saves the token (back in AuthContext)

```jsx
localStorage.setItem('token', data.token);
setUser(data.user);
```

- `localStorage` is a small storage space in your browser. The token stays there even after you close the browser.
- `setUser` changes the state, so every component that uses `useAuth()` now knows who you are.
  The Topbar shows "Council Officer" with the "officer" badge.
- `isOfficer` becomes `true`, so pages show the Add, Edit, and Delete buttons.

### Step 9. Go to the dashboard (LoginPage again)

`navigate('/')` changes the address to `/`. In `App.jsx`, `/` is inside `<ProtectedRoute />`:

```jsx
<Route element={<ProtectedRoute />}>
  <Route element={<Layout />}>
    <Route path="/" element={<DashboardPage />} />
```

`ProtectedRoute` sees that `user` is not null, so it shows the page. `Layout` draws the sidebar and top bar,
and `DashboardPage` opens.

### Step 10. The first request WITH the token

`DashboardPage` calls `getDashboard()` in its `useEffect`. This time the axios interceptor finds the token:

```js
apiClient.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});
```

In `routes/api.php`, `/dashboard` is inside `Route::middleware('auth:sanctum')`.
Sanctum reads the `Authorization` header, finds the matching row in `personal_access_tokens`, and knows the user.
Then `DashboardController` adds up the payments and sends the totals back as JSON,
and the dashboard shows **PHP 1,800.00** collected.

**What if something is wrong?**

- No token or a bad token: Sanctum answers `401 {"message": "Unauthenticated."}`.
  The response interceptor in `client.js` removes the token and sends you to `/login`.
- A viewer tries to change data: the `officer` middleware (`OfficerOnly.php`) answers
  `403 {"message": "Only officers can do this. Your account can only view records."}`.

### Logging out

**Logout** calls `POST /api/logout`. `AuthController@logout` deletes the token row
(`$request->user()->currentAccessToken()->delete()`), so that token never works again.
React removes the token from `localStorage` and sets `user` back to `null`.

---

## Next

See the checklist of things you must do by hand: [06. Manual steps checklist](06-manual-steps-checklist.md).
