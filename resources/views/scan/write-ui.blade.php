<!DOCTYPE html>
<html>
<head>
    <title>WA Writer (Write Anywhere)</title>
    <style>
        body {
            font-family: monospace;
            padding: 20px;
        }
        textarea {
            width: 100%;
            height: 350px;
        }
        button {
            padding: 10px 20px;
            margin-top: 10px;
        }
        .success {
            color: green;
        }
        .error {
            color: red;
        }
    </style>
</head>
<body>

<h2>WA Format Writer</h2>

<p>
Paste your <strong>WA (Write Anywhere)</strong> formatted content below:
</p>

<form method="POST" action="{{ url('/scan/write') }}">
    @csrf

    <textarea name="data">{{ old('data') }}</textarea>

    <br>

    <button type="submit">Write Files</button>
</form>

@if(session('success'))
    <p class="success">{{ session('success') }}</p>
@endif

@if(session('error'))
    <p class="error">{{ session('error') }}</p>
@endif

</body>
</html>
