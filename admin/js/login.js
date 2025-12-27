

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('errorMsg');
        const errorText = document.getElementById('errorText');

        try {
            const res = await fetch(`/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                window.location.href = 'dashboard.html';
            } else {
                errorText.innerText = data.msg || 'Erro ao fazer login';
                errorDiv.classList.remove('hidden');
            }
        } catch (err) {
            console.error(err);
            errorText.innerText = 'Erro de conexão com o servidor.';
            errorDiv.classList.remove('hidden');
        }
    });

});