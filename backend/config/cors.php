<?php

// cors.php
// CORS settings. CORS is a browser safety rule: a page from one address
// (the React app at http://localhost:5173) may only call another address
// (the API at http://127.0.0.1:8000) if the API says it is allowed.
//
// We log in with a token (not cookies), so allowing every origin ('*') is fine
// while you learn. If you put the app online, change allowed_origins to your
// React app's address, for example ['https://my-workspace-app.com'].

return [

    // Which addresses get CORS headers. All our API routes start with "api/".
    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // false, because we send a token in a header instead of cookies.
    'supports_credentials' => false,

];
