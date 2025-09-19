(function() {
    const token = localStorage.getItem('jwt_token');

    if (token) {
        window.location.replace('/src/pages/dashboard/dashboard.html');
    } else {
        window.location.replace('/src/pages/login/login.html');
    }
})()