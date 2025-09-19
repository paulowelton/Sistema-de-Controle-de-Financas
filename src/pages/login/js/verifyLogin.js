async function login(email, password){
    endpoint = '/api/login'
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        const data = await response.json()

        return data
}

const form = document.querySelector('#form')

form.addEventListener('submit', async (event) => {

    event.preventDefault(); 

    const email = document.querySelector('#email').value
    const password = document.querySelector('#password').value
    
    try {
        data = await login(email, password)

        if(!data.token){
            const msgError = document.querySelector('#msg-error')

            msgError.innerHTML = 'Invalid Credencials'
            return
        }

        localStorage.setItem('jwt_token', data.token);
        window.location.replace('/src/pages/dashboard/dashboard.html');
    
    }catch (error) {

        console.log(`error: ${error}`)
    }
})
