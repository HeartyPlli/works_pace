# 04. Run the app

This guide shows how to start the app every day, how to log in, and what every page does.

[Back to README](../README.md) | Before this: [03. Set up the frontend](03-setup-frontend.md) | Next: [05. How the code works](05-how-the-code-works.md)

---

## Every time you want to use the app

You need **three things running**: MySQL, the Laravel API, and the React app.

1. **Start MySQL.** Open the XAMPP Control Panel and click **Start** next to **MySQL** (or **Start All** in Laragon).
2. **Terminal 1, start the API:**

   ```powershell
   cd backend\filee
   php artisan serve
   ```

   Wait for `Server running on [http://127.0.0.1:8000]`.

3. **Terminal 2, start the React app:**

   ```powershell
   cd frontend\filee
   npm run dev
   ```

   Wait for `Local:   http://localhost:5173/`.

4. **Open** http://localhost:5173 in your browser.

> Tip: in VS Code, the terminal area has a **+** button for a new terminal, and a split button
> to see two terminals side by side.

**When you are done:** press **Ctrl + C** in both terminals, then click **Stop** next to MySQL in XAMPP.

---

## Log in

1. Open http://localhost:5173. You see the **Workspace** login box.
2. Type an email and password:

   | Role | Email | Password | What you can do |
   |------|-------|----------|-----------------|
   | officer | officer@example.com | password | Everything |
   | viewer | viewer@example.com | password | Look only |

3. Click **Login**.
4. **When it works:** you see the Dashboard, and the top right corner shows your name and role.
5. **If it says "Wrong email or password."**: check for typing mistakes.
6. **If it says "Cannot reach the server. Is the Laravel server running?"**: Terminal 1 is not running `php artisan serve`.

You stay logged in even if you close the browser, because the login token is saved in the browser.
Click **Logout** (top right) to log out.

---

## A tour of every page

### Dashboard (home page)

- **Total collected:** all the money paid so far.
- **Total unpaid:** all the money students still owe.
- **Latest resolutions:** the 5 newest resolutions. Click one to open its print page.
- **Most repeated errors:** the 5 journal entries with the highest "seen" count. Click one to open it.

With the sample data you should see **PHP 1,800.00** collected and **PHP 1,325.00** unpaid.

### Resolutions

The menu item **Resolutions** shows every resolution, newest first.

- **Search:** type a word (for example `penalty`) and press **Enter** or click **Search**.
  It looks in the title and in the text.
- **Year filter and status filter:** the list changes as soon as you pick a value.
- **Add resolution** (officer only): fill in the form. Above the form you see
  "This will be Resolution No. 0004, Series of 2026". You do not type the number. The app gives the next free number
  for the series year. The number starts again at 1 in a new year.
- **Edit** (officer only): change the text, the status, or the date adopted.
  If you change the series year, the resolution gets the next number of the new year.
- **Delete** (officer only): asks "Delete Resolution No. ...?" first.
- **Print:** opens a clean page that looks like a paper document, with signature lines.
  Click the blue **Print** button to open your browser's print window. The buttons and the menu do not appear on paper.
  Tip: in the print window, you can choose "Save as PDF".

### Students

- **Search** by name or student number.
- **Add student** and **Edit** (officer only) open a small pop up form.
  The student number must be unique. If it is already used, you see "The student number has already been taken."
- **Delete** (officer only): this also deletes the student's charges and payments, so the app asks first.
- **Ledger:** opens the student's ledger (see below).

### Student ledger

Open it from the **Ledger** button on the Students page or the Unpaid Report.

- Three boxes on top: **Total due**, **Total paid**, and **Balance**.
- **Charges table:** every charge given to the student, with the amount due, the amount paid, and the balance.
- **Add payment** (officer only, only when the balance is more than 0):
  type the amount, the date, and the receipt number. The amount starts as the full balance, but you can type less.
  A student can pay in parts. The app does not allow paying more than the balance.
- **Payments table:** every payment, with the receipt number and who received it.

Try it: open the ledger of **Patricia Castillo**. She paid PHP 50 two times for the Membership Fee,
so her balance is PHP 50.00.

### Charges

- The table shows each charge (fee or penalty), the amount, the school year, the resolution that approved it,
  and how many times it was given to students.
- **Add charge** (officer only): name, type, amount, school year, and (optional) the resolution that approved it.
- **Assign to students** (officer only): opens a pop up with every student and a checkbox for each.
  - Type in the filter box to find students fast.
  - **Tick all shown** ticks every student in the list you see. **Untick all** clears them.
  - The amount due starts as the charge amount. You can change it (for example, for a discount).
  - Click **Assign**. You see a message like "Absence Penalty was assigned to 3 student(s)."

### Unpaid Report

A list of every student who still owes money, with the total due, total paid, and balance for each,
plus **Total owed** for everyone. With the sample data: **10 students** owe **PHP 1,325.00**.

### Error Fix Journal

Your notebook of errors you have solved.

- **Search:** looks in the title and the error message.
- **All tags** list: show only entries with one tag. You can also click a tag on any entry.
- **Favorites only:** show only entries with a star.
- Click an entry title to open it.
- **Add entry** (officer only): title, error message, cause, fix, code snippet, source link, and tags.
  Type tags with commas between them, like `Laravel, React, CORS`. New tags are made for you.

### One journal entry

- **Error message** and **Code snippet** show in a grey box with a **Copy** button.
  Click it and the text is copied. The button says "Copied!" for 2 seconds.
- **Seen again (+1)** (officer only): you met this error again. The "Seen" number goes up by 1, and "Last seen" becomes today.
- **Add to favorites / Remove favorite** (officer only): turns the star on or off.
- **Edit** and **Delete** (officer only).

---

## Try the viewer account

Log out, then log in as `viewer@example.com`. You can open every page, but the
Add, Edit, Delete, Assign, Add payment, and Seen again buttons are gone.
Even if someone sends a change request to the API by hand, the API answers
"Only officers can do this. Your account can only view records."

---

## Next

Want to understand what happens behind the screen? Read [05. How the code works](05-how-the-code-works.md).
