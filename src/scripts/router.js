(function() {
    const token = localStorage.getItem('jwt_token');

    if (token) {
        window.location.replace('/dashboard.html');
    } else {
        window.location.replace('/login.html');
    }
})();