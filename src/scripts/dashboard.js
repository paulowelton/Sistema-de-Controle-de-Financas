async function verifyJWT() {
    const token = localStorage.getItem('jwt_token') 

    const response = await fetch('/api/verify_jwt', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })

    const data = await response.json()
    return data
}

verifyJWT().then(data => {
    alert(data.isValid)
})
