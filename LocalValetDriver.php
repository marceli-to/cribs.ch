<?php

use Valet\Drivers\ValetDriver;

/**
 * Laravel Herd / Valet: serve the static Astro build in dist/.
 * (Needed because dist/ contains a "public" folder with the legacy assets,
 * which Herd would otherwise mistake for the webroot.) Run `npm run build` first.
 */
class LocalValetDriver extends ValetDriver
{
    public function serves(string $sitePath, string $siteName, string $uri): bool
    {
        return is_dir($sitePath . '/dist');
    }

    /** Assets (CSS, JS, images, video) are handed to nginx. */
    public function isStaticFile(string $sitePath, string $siteName, string $uri)/*: string|false */
    {
        $path = $sitePath . '/dist' . rawurldecode($uri);

        return is_file($path) ? $path : false;
    }

    /** Pages (directory/index.html) and the 404 page are output directly. */
    public function frontControllerPath(string $sitePath, string $siteName, string $uri): ?string
    {
        $page = rtrim($sitePath . '/dist' . rawurldecode($uri), '/') . '/index.html';

        if (! is_file($page)) {
            http_response_code(404);
            $page = $sitePath . '/dist/404.html';
        }

        header('Content-Type: text/html; charset=utf-8');
        readfile($page);
        exit;
    }
}
