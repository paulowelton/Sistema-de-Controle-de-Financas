async function getUser(){
    const token = localStorage.getItem('jwt_token')
    const response = await fetch('/api/getUser',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })

    if (response.status === 401){
        alert('Token inválido ou expirado. Por favor, faça login novamente.')
        localStorage.removeItem('jwt_token')
        window.location.replace('/login.html')
        return null
    }

    const data = await response.json()
    return data
}

getUser().then (data => {
    if(data){
        user = data.user[0]
        const ola = document.querySelector('#ola')
        ola.innerHTML = `Olá, ${user.name}!`
    }
})


