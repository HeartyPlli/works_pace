# 01. Install the tools

Before you can run Workspace, your computer needs some programs ("tools").
This guide shows how to install each one, and how to check that it works.

[Back to README](../README.md) | Next: [02. Set up the backend](02-setup-backend.md)

---

## New words

- **Folder:** a place on your computer that holds files. (Some people say "directory".)
- **Terminal:** a window where you type commands instead of clicking. On Windows we use **PowerShell**.
- **Command:** a line of text you type in the terminal, then press **Enter** to run it.
- **Version command:** a command like `php -v` that prints which version of a tool you have.
  If it prints a version number, the tool is installed and the terminal can find it.
- **PATH:** a list of folders where the terminal looks for programs. If a tool's folder is not in the PATH,
  the terminal says it "is not recognized" or "command not found".

---

## How to open a terminal

**Windows**

1. Press the **Windows key**, type `PowerShell`, and press **Enter**.
2. A blue or black window opens. That is your terminal.

**Windows, inside VS Code (easier later)**

1. Open the project folder in VS Code (**File > Open Folder...**).
2. Press **Ctrl + `** (the key above Tab). A terminal opens at the bottom, already inside the project folder.

**macOS:** press **Cmd + Space**, type `Terminal`, press **Enter**.

**Linux:** press **Ctrl + Alt + T**.

> **Important:** after you install a new tool, **close the terminal and open a new one**.
> An old terminal does not know about tools installed after it was opened.

---

## What you need

| Tool | What it is for | Check command |
|------|----------------|---------------|
| PHP 8.2 or newer | The language Laravel is written in | `php -v` |
| Composer | Downloads PHP packages (like Laravel) | `composer --version` |
| Node.js 20.19+ or 22.12+ (includes npm) | Runs the React tools | `node -v` and `npm -v` |
| MySQL (or MariaDB) | The database that stores the data | see below |
| VS Code | A code editor | open it from the Start menu |
| Git | Saves versions of your code | `git --version` |

---

## Windows

### Step 1. Install XAMPP (PHP + MySQL + phpMyAdmin)

XAMPP is one installer that gives you PHP, MySQL (it is called MariaDB inside XAMPP, and it works the same way),
and phpMyAdmin (a web page for managing databases).

1. Go to https://www.apachefriends.org and download XAMPP for Windows **with PHP 8.2 or newer**.
2. Run the installer. Keep the normal choices. Install it to `C:\xampp`.
3. Open the **XAMPP Control Panel** (search for it in the Start menu).
4. Click **Start** next to **MySQL**. The word "MySQL" turns green.
5. Also click **Start** next to **Apache** if you want to use phpMyAdmin.

**Let the terminal find PHP (add it to the PATH):**

1. Press the **Windows key**, type `environment`, and click **Edit the system environment variables**.
2. Click **Environment Variables...**
3. Under **System variables**, click **Path**, then **Edit...**
4. Click **New** and type `C:\xampp\php`
5. Click **OK** on every window.
6. Close all terminals and open a new one.

**Turn on the zip extension (needed by Composer):**

1. Open the file `C:\xampp\php\php.ini` in VS Code or Notepad.
2. Press **Ctrl + F** and search for `;extension=zip`
3. Delete the `;` at the start of that line, so it says `extension=zip`
4. Save the file (**Ctrl + S**). If Windows says you cannot save, open the editor with right click > **Run as administrator**.

**Check PHP:**

```powershell
php -v
```

You should see something like:

```
PHP 8.2.12 (cli) (built: Oct 24 2023 21:15:15) (ZTS Visual C++ 2019 x64)
```

The first number must be 8.2 or higher.

### Other choice: Laragon

Laragon (https://laragon.org) is another all in one tool. It includes PHP, MySQL, Composer, and Node.js,
and it adds them to the PATH for you. If you use Laragon:

- Click **Start All** to start MySQL.
- Make sure its PHP version is 8.2 or newer (**Menu > PHP > Version**).
- Your database password is empty, just like XAMPP.

Use XAMPP **or** Laragon, not both. Two MySQL programs on one computer will fight over port 3306.

### Step 2. Install Composer

1. Go to https://getcomposer.org/download and click **Composer-Setup.exe**.
2. Run it. Leave "Developer mode" unticked.
3. On the "Settings Check" screen, choose `C:\xampp\php\php.exe` (or Laragon's php.exe).
4. Click **Next** until it finishes.
5. Close all terminals and open a new one.

**Check:**

```powershell
composer --version
```

You should see something like `Composer version 2.11.2 2026-11-10 10:09:37`.

### Step 3. Install Node.js (this also installs npm)

1. Go to https://nodejs.org and download the **LTS** version (LTS means "long term support", the stable one).
2. Run the installer with the normal choices.
3. Close all terminals and open a new one.

**Check:**

```powershell
node -v
npm -v
```

You should see two version numbers, like `v22.12.0` and `10.9.0`.
Node must be 20.19 or newer (or 22.12 or newer).

> If PowerShell says "running scripts is disabled on this system" when you run `npm`,
> see [07-troubleshooting.md](07-troubleshooting.md#npm-says-running-scripts-is-disabled).

### Step 4. Install VS Code

1. Go to https://code.visualstudio.com and download it.
2. Run the installer. Tick **Add "Open with Code" action** if you see it.

### Step 5. Install Git

1. Go to https://git-scm.com/download/win and download it.
2. Run the installer with the normal choices.
3. Close all terminals and open a new one.

**Check:**

```powershell
git --version
```

You should see something like `git version 2.47.1.windows.2`.

### Step 6. Check MySQL

In the XAMPP Control Panel, **MySQL** must be green.
To check from the terminal:

```powershell
C:\xampp\mysql\bin\mysql.exe --version
```

You should see something like `mysql.exe  Ver 15.1 Distrib 10.4.32-MariaDB, for Win64 (AMD64)`.

---

## macOS (short notes)

1. Install Homebrew (a tool that installs other tools). Follow the one line command on https://brew.sh
2. Install everything:

   ```bash
   brew install php composer node mysql git
   brew services start mysql
   ```

3. Install VS Code from https://code.visualstudio.com
4. Check: `php -v`, `composer --version`, `node -v`, `npm -v`, `mysql --version`, `git --version`

Homebrew's MySQL user is `root` with an empty password.

---

## Linux (Ubuntu, short notes)

1. Install PHP, MySQL, Git, and the PHP parts Laravel needs:

   ```bash
   sudo apt update
   sudo apt install php-cli php-mysql php-xml php-mbstring php-curl php-zip php-bcmath unzip mysql-server git
   ```

2. Install Composer: follow the "Command-line installation" steps on https://getcomposer.org/download
   then run `sudo mv composer.phar /usr/local/bin/composer`
3. Install Node.js 22 with nvm (a Node version manager): follow https://github.com/nvm-sh/nvm then run `nvm install 22`
4. Ubuntu's MySQL `root` user has no normal password. Make a user for the app:

   ```bash
   sudo mysql
   CREATE USER 'workspace'@'localhost' IDENTIFIED BY 'choose-a-password';
   GRANT ALL PRIVILEGES ON workspace.* TO 'workspace'@'localhost';
   EXIT;
   ```

   Later, put this user and password in `backend/filee/.env`.
5. Check: `php -v`, `composer --version`, `node -v`, `npm -v`, `mysql --version`, `git --version`

---

## Done?

Every check command printed a version number? Great.
Go to [02. Set up the backend](02-setup-backend.md).

A command says "not recognized" or "command not found"? See
[07-troubleshooting.md](07-troubleshooting.md#composer-npm-php-or-node-is-not-recognized).
