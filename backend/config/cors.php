<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | to easily configure cross-origin requests. By default, we will allow
    | all origins for all verbs and all headers.
    |
    | You can change the allowed origins, headers, and methods.
    |
    | For more detailed information about the CORS configuration, please visit:
    | https://laravel.com/docs/master/routing#cors
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Ensure dev frontend ports can reach the backend (CRA usually runs on 3000, Vite on 5173)
    'allowed_origins' => ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
