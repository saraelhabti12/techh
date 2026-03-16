<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken as BaseVerifier;

class ValidateCsrfToken extends BaseVerifier
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        // Exclude API routes to allow stateless token-based auth / cross-origin SPA usage.
        'api/*',
    ];
}
