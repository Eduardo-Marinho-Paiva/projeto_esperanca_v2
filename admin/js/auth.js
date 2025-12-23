// Script utilitário para checar login em todas as páginas admin
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token && !window.location.href.includes('login.html')) {
        window.location.href = 'login.html';
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

if (!window.location.href.includes('login.html')) {
    checkAuth();
}