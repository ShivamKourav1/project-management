<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ScanController extends Controller
{
    public function scan(Request $request, $path = '')
    {
        // Convert "__" back to "."
        $path = str_replace('__', '.', $path);

        // Base directory (Laravel root)
        $basePath = base_path();

        // Final absolute path
        $fullPath = realpath($basePath . DIRECTORY_SEPARATOR . $path);

        /**
         * SECURITY CHECK
         * Prevent directory traversal like ../../
         */
        if (!$fullPath || !Str::startsWith($fullPath, $basePath)) {
            abort(403, 'Access denied');
        }

        // If directory → list contents
        if (is_dir($fullPath)) {
            $items = File::directories($fullPath);
            $files = File::files($fullPath);

            return response()->view('scan.directory', [
                'path'  => $path,
                'dirs'  => $items,
                'files' => $files,
                'base'  => $basePath
            ]);
        }

        // If file → show raw content
        if (is_file($fullPath)) {
            return response(
                File::get($fullPath),
                200,
                ['Content-Type' => 'text/plain']
            );
        }

        abort(404, 'Not found');
    }

    public function writeFiles(Request $request)
    {
        // Safety: local only
        if (!app()->isLocal()) {
            abort(403, 'Write access disabled');
        }

        $input = $request->input('data');

        if (!$input) {
            return back()->with('error', 'No input provided');
        }

        $basePath = realpath(base_path());
        $written = [];
        $deleted = [];

        /**
         * -----------------------------
         * 1. HANDLE DELETE BLOCKS
         * @@path@d@
         * -----------------------------
         */
        preg_match_all(
            '/@@(.*?)@d@/',
            $input,
            $deleteMatches,
            PREG_SET_ORDER
        );

        foreach ($deleteMatches as $match) {
            $relativePath = trim($match[1]);
            $fullPath = $basePath . DIRECTORY_SEPARATOR . $relativePath;

            // Security check
            if (!Str::startsWith(realpath(dirname($fullPath)) ?: '', $basePath)) {
                return back()->with('error', "Access denied: {$relativePath}");
            }

            if (File::exists($fullPath)) {
                File::delete($fullPath);
                $deleted[] = $relativePath;
            }
        }

        /**
         * -----------------------------
         * 2. HANDLE WRITE BLOCKS
         * @@path@s@ content @e@
         * -----------------------------
         */
        preg_match_all(
            '/@@(.*?)@s@(.*?)@e@/s',
            $input,
            $writeMatches,
            PREG_SET_ORDER
        );

        foreach ($writeMatches as $match) {
            $relativePath = trim($match[1]);
            $content = ltrim($match[2], "\n");

            $fullPath = $basePath . DIRECTORY_SEPARATOR . $relativePath;
            $dir = dirname($fullPath);

            // Security check
            if (!Str::startsWith(realpath($dir) ?: '', $basePath)) {
                return back()->with('error', "Access denied: {$relativePath}");
            }

            // Ensure directory exists
            File::ensureDirectoryExists($dir);

            // Create file if not exists + write
            File::put($fullPath, $content);

            $written[] = $relativePath;
        }

        return back()->with('success',
            'Written: ' . implode(', ', $written) .
            ' | Deleted: ' . implode(', ', $deleted)
        );
    }


    public function writeUi()
    {
        // Safety: allow only in local environment
        if (!app()->isLocal()) {
            abort(403);
        }

        return view('scan.write-ui');
    }

}
