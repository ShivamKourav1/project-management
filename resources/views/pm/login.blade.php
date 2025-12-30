<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Project Management Tool</title>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f6f8; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
        h2 { text-align: center; margin-bottom: 8px; }
        p { text-align: center; color: #666; margin-bottom: 30px; }
        input { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 6px; font-size: 16px; box-sizing: border-box; }
        button { width: 100%; padding: 14px; background: #1976d2; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; }
        button:disabled { background: #aaa; cursor: not-allowed; }
        .error { color: red; text-align: center; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="card">
        <h2>Project Management Tool</h2>
        <p>Sign in to continue</p>
        <form id="loginForm">
            <input type="email" id="email" placeholder="Email" required />
            <input type="password" id="password" placeholder="Password" required />
            <div class="error" id="error"></div>
            <button type="submit" id="submit">Login</button>
        </form>
        <p style="text-align:center; margin-top:20px; font-size:14px; color:#888;">
            Use any user from your <code>users</code> table
        </p>
    </div>

    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const errorEl = document.getElementById('error');
            const btn = document.getElementById('submit');
            
            if (!email || !password) return;

            errorEl.textContent = '';
            btn.disabled = true;
            btn.textContent = 'Logging in...';

            try {
                // Step 1: Fetch CSRF cookie (this sets XSRF-TOKEN and laravel_session cookies)
                await axios.get('/sanctum/csrf-cookie', { withCredentials: true });

                // Step 2: Now login
                await axios.post('/login', { email, password }, { withCredentials: true });

                // Success → redirect to main app
                window.location.href = '/pm';
            } catch (err) {
                errorEl.textContent = err.response?.data?.message || 'Login failed. Check credentials.';
            } finally {
                btn.disabled = false;
                btn.textContent = 'Login';
            }
        });
    </script>
</body>
</html>

