# Workspace changes

This file records the latest app update. The original README and numbered guides are preserved. Use the notes below wherever those guides describe the previous login or collection workflow.

## Login and access

- The app is still named **Workspace**. The login screen displays **Workspace** and has no logo.
- The eye button in the password field shows or hides what you typed. Passwords start hidden on both the sign-in and account request forms.
- The old default viewer sign-in is disabled. Authorized members sign in on the same page with separate accounts and can edit the shared records.
- On the Workspace login screen, choose **Create an account**. Enter a Gmail address as the username, choose a Workspace password of at least 12 characters, and choose whether to show the **Error Fix Journal** on your dashboard.
- The workspace owner approves requests from **Account → Account requests**. Once approved, the member can sign in. Approved members can edit the shared records.
- Change the journal setting at any time under **Account → Dashboard preferences**. The checkbox controls the dashboard's journal card and shortcut. The journal page is still available from the sidebar.
- On a fresh installation, the seeder creates one initial officer account. The `php artisan workspace:add-user` command remains available to server operators.
- The existing local owner now signs in with the updated Gmail address and Workspace password. This change was made in the local database, and existing owner sessions were signed out.

## Documents

Use **Documents** to create, edit, read, and organize meeting minutes, narrative reports, and other council documents. Set a title, type, and date, then write content, attach a file, or do both. Find documents by title, filename, or type. Attachments are available after sign-in.

## Collections

The separate Students, Charges, and Unpaid Report pages were combined into **Collections**.

1. Create a collection with a school year, expected student count, and amount per student. Link the approving resolution if applicable.
2. Add students manually or import a UTF-8 CSV with `student_id,name` headers. Student ID identifies each row within the collection. Importing an existing ID updates the name and keeps the recorded payment.
3. Mark a student as paid and enter the official receipt (OR) number. Use **Edit payment** to correct or clear a recorded payment.
4. Check the collected amount, outstanding roster balance, and expected target. **Export CSV** includes student IDs, payment statuses, receipt numbers, and a totals row.

Example roster:

```csv
student_id,name
2026-001,Alex Rivera
2026-002,Jamie Cruz
```

## Updating an existing installation

Run `php artisan migrate` from `backend/filee`. The migrations add the account settings and copy existing collection balances and receipt references into the new tables. The original tables and payment history are preserved.

Back up the database and the backend's private attachment storage when using Documents on a hosted instance.
