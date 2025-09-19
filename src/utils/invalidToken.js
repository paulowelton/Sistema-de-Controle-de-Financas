export function invalidToken() {
    alert("Token inválido ou expirado. Por favor, faça login novamente.")
    localStorage.removeItem("jwt_token")
    window.location.replace("/login.html")
}