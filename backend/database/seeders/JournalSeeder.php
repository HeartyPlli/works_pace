<?php

// JournalSeeder.php
// Makes sample Error Fix Journal entries with tags.
// These are real beginner errors, so the journal is useful from day one.

namespace Database\Seeders;

use App\Models\ErrorEntry;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;

class JournalSeeder extends Seeder
{
    public function run(): void
    {
        $officer = User::where('email', 'officer@example.com')->first();

        $entries = [
            [
                'title' => 'CORS error when React calls the Laravel API',
                'error_message' => "Access to XMLHttpRequest at 'http://127.0.0.1:8000/api/login' from origin 'http://localhost:5173' has been blocked by CORS policy",
                'cause' => 'The API did not send the CORS headers, or the address in VITE_API_URL was wrong.',
                'fix' => "Check config/cors.php: 'paths' must include 'api/*'. Check that VITE_API_URL in frontend/.env is correct. Then restart both servers.",
                'code_snippet' => "'paths' => ['api/*'],\n'allowed_origins' => ['*'],",
                'source_url' => 'https://laravel.com/docs/12.x/routing#cors',
                'seen_count' => 6,
                'is_favorite' => true,
                'days_ago' => 2,
                'tags' => ['Laravel', 'React', 'CORS'],
            ],
            [
                'title' => 'Database connection refused',
                'error_message' => 'SQLSTATE[HY000] [2002] No connection could be made because the target machine actively refused it',
                'cause' => 'MySQL was not running.',
                'fix' => 'Open the XAMPP Control Panel (or Laragon) and click Start next to MySQL. Then try again.',
                'code_snippet' => null,
                'source_url' => null,
                'seen_count' => 5,
                'is_favorite' => true,
                'days_ago' => 1,
                'tags' => ['MySQL', 'Laravel'],
            ],
            [
                'title' => 'Table does not exist',
                'error_message' => "SQLSTATE[42S02]: Base table or view not found: 1146 Table 'workspace.students' doesn't exist",
                'cause' => 'I forgot to run the migrations after making the database.',
                'fix' => 'Run the migrations in the backend folder.',
                'code_snippet' => 'php artisan migrate',
                'source_url' => 'https://laravel.com/docs/12.x/migrations',
                'seen_count' => 4,
                'is_favorite' => false,
                'days_ago' => 5,
                'tags' => ['Laravel', 'MySQL'],
            ],
            [
                'title' => 'Composer is not recognized',
                'error_message' => "'composer' is not recognized as an internal or external command, operable program or batch file.",
                'cause' => 'Composer was not installed, or the terminal was opened before installing it.',
                'fix' => 'Install Composer with Composer-Setup.exe, then close the terminal and open a new one.',
                'code_snippet' => 'composer --version',
                'source_url' => 'https://getcomposer.org/download/',
                'seen_count' => 2,
                'is_favorite' => false,
                'days_ago' => 20,
                'tags' => ['Composer', 'Windows'],
            ],
            [
                'title' => 'Cannot read properties of undefined (reading map)',
                'error_message' => "Uncaught TypeError: Cannot read properties of undefined (reading 'map')",
                'cause' => 'I used .map() on data that was not loaded yet.',
                'fix' => 'Start the state with an empty list: useState([]). Then .map() works even before the data arrives.',
                'code_snippet' => "const [students, setStudents] = useState([]);\n\nstudents.map((student) => <li key={student.id}>{student.name}</li>);",
                'source_url' => 'https://react.dev/learn/rendering-lists',
                'seen_count' => 3,
                'is_favorite' => false,
                'days_ago' => 3,
                'tags' => ['React', 'JavaScript'],
            ],
            [
                'title' => 'Each child in a list should have a unique key',
                'error_message' => 'Warning: Each child in a list should have a unique "key" prop.',
                'cause' => 'I made a list with .map() but did not give each item a key.',
                'fix' => 'Add key={item.id} to the outer element inside .map().',
                'code_snippet' => '{tags.map((tag) => <span key={tag.id}>{tag.name}</span>)}',
                'source_url' => 'https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key',
                'seen_count' => 2,
                'is_favorite' => false,
                'days_ago' => 8,
                'tags' => ['React'],
            ],
            [
                'title' => '401 Unauthorized from the API',
                'error_message' => 'Request failed with status code 401 {"message":"Unauthenticated."}',
                'cause' => 'The request had no token, or the token was deleted after logout.',
                'fix' => 'Log in again. Make sure axios sends the header Authorization: Bearer <token>.',
                'code_snippet' => "config.headers.Authorization = 'Bearer ' + token;",
                'source_url' => 'https://laravel.com/docs/12.x/sanctum#api-token-authentication',
                'seen_count' => 3,
                'is_favorite' => true,
                'days_ago' => 4,
                'tags' => ['Laravel', 'Sanctum', 'React'],
            ],
            [
                'title' => 'Vite port is already in use',
                'error_message' => 'Port 5173 is in use, trying another one...',
                'cause' => 'Another terminal was still running npm run dev.',
                'fix' => 'Close the old terminal, or press Ctrl + C in it. Then run npm run dev again.',
                'code_snippet' => 'npm run dev',
                'source_url' => 'https://vite.dev/config/server-options',
                'seen_count' => 1,
                'is_favorite' => false,
                'days_ago' => 12,
                'tags' => ['Vite', 'npm'],
            ],
            [
                'title' => 'No application encryption key',
                'error_message' => 'No application encryption key has been specified.',
                'cause' => 'The APP_KEY in the .env file was empty.',
                'fix' => 'Run the key command in the backend folder. It fills APP_KEY for you.',
                'code_snippet' => 'php artisan key:generate',
                'source_url' => 'https://laravel.com/docs/12.x/encryption',
                'seen_count' => 1,
                'is_favorite' => false,
                'days_ago' => 25,
                'tags' => ['Laravel'],
            ],
            [
                'title' => 'Controller class not found',
                'error_message' => 'Target class [App\\Http\\Controllers\\StudentController] does not exist.',
                'cause' => 'The namespace at the top of the controller did not match its folder.',
                'fix' => 'A file in app/Http/Controllers must start with: namespace App\\Http\\Controllers; Then run composer dump-autoload.',
                'code_snippet' => "namespace App\\Http\\Controllers;\n\nclass StudentController extends Controller",
                'source_url' => 'https://laravel.com/docs/12.x/controllers',
                'seen_count' => 2,
                'is_favorite' => false,
                'days_ago' => 15,
                'tags' => ['Laravel', 'PHP'],
            ],
        ];

        foreach ($entries as $data) {
            $entry = ErrorEntry::create([
                'user_id' => $officer->id,
                'title' => $data['title'],
                'error_message' => $data['error_message'],
                'cause' => $data['cause'],
                'fix' => $data['fix'],
                'code_snippet' => $data['code_snippet'],
                'source_url' => $data['source_url'],
                'seen_count' => $data['seen_count'],
                'is_favorite' => $data['is_favorite'],
                'last_seen_at' => now()->subDays($data['days_ago']),
            ]);

            // Find or make each tag, then connect the tags to the entry.
            $tagIds = [];
            foreach ($data['tags'] as $tagName) {
                $tag = Tag::firstOrCreate(['name' => $tagName]);
                $tagIds[] = $tag->id;
            }
            $entry->tags()->sync($tagIds);
        }
    }
}
