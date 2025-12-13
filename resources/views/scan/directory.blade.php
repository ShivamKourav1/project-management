<!DOCTYPE html>
<html>
<head>
    <title>Directory Scan</title>
    <style>
        body { font-family: monospace; }
        a { text-decoration: none; }
    </style>
</head>
<body>

<h3>Directory: /{{ $path }}</h3>

<ul>
    @if($path)
        <li>
            <a href="{{ url('/scan/' . dirname($path)) }}">⬅️ ..</a>
        </li>
    @endif

    @foreach($dirs as $dir)
        @php
            $relative = trim(str_replace($base, '', $dir), DIRECTORY_SEPARATOR);
        @endphp
        <li>
            📁 <a href="{{ url('/scan/' . str_replace('.', '__', $relative)) }}">
                {{ basename($dir) }}
            </a>
        </li>
    @endforeach

    @foreach($files as $file)
        @php
            $relative = trim(str_replace($base, '', $file->getPathname()), DIRECTORY_SEPARATOR);
        @endphp
        <li>
            📄 <a href="{{ url('/scan/' . str_replace('.', '__', $relative)) }}">
                {{ $file->getFilename() }}
            </a>
        </li>
    @endforeach
</ul>

</body>
</html>
