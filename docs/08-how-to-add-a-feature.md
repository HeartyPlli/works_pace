# 08. How to add a feature

The best way to learn is to change the app yourself. This tutorial has two small exercises:

- **Part 1:** add a new field, a **contact number** for each student. (Backend and frontend.)
- **Part 2:** add a new page, a **Tags** page that lists every journal tag. (Frontend only.)

These are exercises. The app does not have them yet, so the files below do not have this code until you add it.

[Back to README](../README.md) | Before this: [07. Troubleshooting](07-troubleshooting.md) | Next: [09. Put it on GitHub](09-put-it-on-github.md)

---

## Before you start

- Both servers are running (`php artisan serve` and `npm run dev`). See [04-run-the-app.md](04-run-the-app.md).
- Tip: make a backup first. If you use Git, run `git add .` and `git commit -m "Before my change"`.
  Then, if you break something, `git checkout .` brings the old files back.

---

## Part 1. Add a "contact number" field to students

A new field has to travel through 5 places. Remember this list. It is the same for every new field:

1. **Migration:** add the column to the database table.
2. **Model:** allow the column to be saved.
3. **Controller:** check (validate) the new value.
4. **Form (React):** add an input box.
5. **Table (React):** show the value.

### Step 1. Make a migration

In the `backend` folder, run:

```powershell
php artisan make:migration add_contact_no_to_students_table
```

**When it works:**

```
   INFO  Migration [C:\...\workspace\backend\database\migrations\2026_11_24_101500_add_contact_no_to_students_table.php] created successfully.
```

(Your date and time numbers will be different. That is normal.)

Laravel reads the name `add_..._to_students_table` and guesses that you want to change the `students` table,
so the new file already says `Schema::table('students', ...)` with an empty spot marked `//`.

Open the new file in `backend/database/migrations/` (the newest one). Change the two methods so they look like this:

```php
public function up(): void
{
    Schema::table('students', function (Blueprint $table) {
        // A new column after "section". It can be empty (nullable).
        $table->string('contact_no', 20)->nullable()->after('section');
    });
}

public function down(): void
{
    Schema::table('students', function (Blueprint $table) {
        $table->dropColumn('contact_no');
    });
}
```

- `up()` adds the column.
- `down()` removes it again (used if you "roll back" the migration).

Save the file, then run:

```powershell
php artisan migrate
```

You should see your new migration with `DONE`. Your old data is still there. The new column is just empty.

> **Do not edit old migrations** like `2026_01_01_000002_create_students_table.php` to add a column.
> Laravel already ran them, so it will not run them again. Always make a NEW migration for a change.

### Step 2. Allow the column in the model

Open `backend/app/Models/Student.php` and add `'contact_no'` to `$fillable`:

```php
protected $fillable = [
    'student_no',
    'name',
    'program',
    'year_level',
    'section',
    'contact_no',
];
```

Without this, Laravel silently ignores `contact_no` when it saves. This protection is called **mass assignment protection**.

### Step 3. Validate the value in the controller

Open `backend/app/Http/Controllers/StudentController.php`.
In **both** `store()` and `update()`, add one line to the list of rules:

```php
'section' => 'required|string|max:50',
'contact_no' => 'nullable|string|max:20',
```

- `nullable` means "it can be empty".
- `max:20` means "at most 20 characters".

Only values that pass `validate()` end up in `$validated`, which is what gets saved.

**Test the backend now.** Nothing in React changed yet, but the API is ready.

### Step 4. Add the input box in the form

Open `frontend/src/pages/StudentForm.jsx`.

First, add `contact_no` to the starting values of the form:

```jsx
const [form, setForm] = useState({
  student_no: student ? student.student_no : '',
  name: student ? student.name : '',
  program: student ? student.program : '',
  year_level: student ? student.year_level : 1,
  section: student ? student.section : '',
  contact_no: student && student.contact_no ? student.contact_no : '',
});
```

(The `student.contact_no` of old students is `null`. Input boxes need text, so we use `''` instead.)

Then add the input box, for example right after the "Year level / Section" row:

```jsx
<label>
  Contact No. (optional)
  <input type="text" name="contact_no" value={form.contact_no} onChange={handleChange} />
</label>
```

The `name="contact_no"` is important: `handleChange` uses it to know which value to change.

### Step 5. Show it in the table

Open `frontend/src/pages/StudentsPage.jsx`. In the `columns` list, add a column
(for example after "Year and section"):

```jsx
{ label: 'Contact No.', render: (row) => row.contact_no || '-' },
```

`|| '-'` means "if it is empty, show a dash".

### Step 6. Try it

1. Save all the files. The browser updates by itself (Vite does that).
2. Go to **Students**, click **Edit** on a student, type a contact number, and click **Save**.
3. The new column shows the number. Refresh the page (**F5**). It is still there, because it is saved in the database.

**If it does not save:** check Step 2 (`$fillable`) and Step 3 (validation). Those are the two most common mistakes.

---

## Part 2. Add a new page: Tags

The API already has `GET /api/tags`, and `frontend/src/api/journalApi.js` already has `getTags()`.
So you only need React. A new page needs 3 things:

1. **A page component** (a new `.jsx` file).
2. **A route** in `App.jsx` (which address shows the page).
3. **A link** in `Sidebar.jsx` (so people can find it).

### Step 1. Make the page component

Make a new file: `frontend/src/pages/TagsPage.jsx`

```jsx
// TagsPage.jsx
// A list of every tag in the Error Fix Journal, and how many entries use it.

import { useEffect, useState } from 'react';
import { getTags } from '../api/journalApi.js';
import DataTable from '../components/DataTable.jsx';
import { getErrorMessage } from '../helpers.js';

export default function TagsPage() {
  const [tags, setTags] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Load the tags once, when the page opens.
  useEffect(() => {
    loadTags();
  }, []);

  async function loadTags() {
    try {
      const data = await getTags();
      setTags(data);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  }

  // Two columns: the tag name, and how many entries use it.
  const columns = [
    { label: 'Tag', render: (row) => row.name },
    { label: 'Entries', render: (row) => row.error_entries_count },
  ];

  return (
    <div>
      <h1>Tags</h1>
      {errorMessage && <p className="alert alert-error">{errorMessage}</p>}
      <DataTable columns={columns} rows={tags} emptyMessage="No tags yet." />
    </div>
  );
}
```

`error_entries_count` comes from `TagController`, which uses `withCount('errorEntries')`.

### Step 2. Add the route

Open `frontend/src/App.jsx`.

At the top, with the other imports, add:

```jsx
import TagsPage from './pages/TagsPage.jsx';
```

Inside `<Route element={<Layout />}>`, under the journal routes, add:

```jsx
<Route path="/tags" element={<TagsPage />} />
```

Because it is inside `ProtectedRoute` and `Layout`, the page needs a login and gets the sidebar for free.

### Step 3. Add the link in the sidebar

Open `frontend/src/components/Sidebar.jsx`. Under the "Error Fix Journal" link, add:

```jsx
<NavLink to="/tags" className="sidebar-link">
  Tags
</NavLink>
```

### Step 4. Try it

Save all files. Click **Tags** in the sidebar. You see a table of tags with their entry counts.
The **Tags** link turns blue because `NavLink` adds the `active` class on the current page.

**If you see a blank page:** press **F12** and read the **Console**. Usually it is a typo in an `import` line,
or a file name with different capital letters.

---

## You did it

You followed the path that every feature takes:

```
database (migration) -> model -> controller -> routes/api.php -> api/*.js -> page component -> App.jsx route -> Sidebar link
```

Not every feature needs every step. Part 1 did not need a new route, and Part 2 did not need the backend.
Ask yourself "which of these steps does my feature need?" and go one step at a time.

**Ideas to practice next:**

- Add an `email` field to students (same steps as Part 1).
- Show the number of students on the Dashboard (change `DashboardController` and `DashboardPage.jsx`).
- Add a "Delete" button for charges (new route, new controller method, new API function, new button).

When you meet an error, add it to your Error Fix Journal.
