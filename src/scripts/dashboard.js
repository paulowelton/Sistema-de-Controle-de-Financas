function invalidToken(){
    alert('Token inválido ou expirado. Por favor, faça login novamente.')
    localStorage.removeItem('jwt_token')
    window.location.replace('/login.html')
}

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
        invalidToken()
        return null
    }

    const data = await response.json()
    return data
}

getUser().then (data => {
    if(data){
        const user = data.user[0]
        
    }
})

async function getEarnings(){
    const token = localStorage.getItem('jwt_token')
    const response = await fetch('/api/getEarnings',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
    })

    if (response.status === 401){
        invalidToken()
        return null
    }

    const data = await response.json()
    return data
}

getEarnings().then (data => {
    if(data){
        let earnings = data.earnings
        let amount = 0
        
        const tbodyTransactions = document.querySelector('#tbody-transacoes')
        for(let i=0; i < earnings.length; i++){
            amount += parseInt(earnings[i].value) 
            
            const tr = document.createElement('tr')

            const descriptionCell = document.createElement('td')
            descriptionCell.textContent = earnings[i].source
            tr.append(descriptionCell)
            
            const valueCell = document.createElement('td')
            valueCell.textContent = earnings[i].value.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })
            tr.append(valueCell)
            
            const dateCell = document.createElement('td')
            const date = new Date(earnings[i].date);
            dateCell.textContent = date.toLocaleDateString('pt-BR')
            tr.append(dateCell)
            
            const methodCell = document.createElement('td')
            methodCell.textContent = earnings[i].forma_pagamento
            tr.append(methodCell)

            tbodyTransactions.append(tr)
        }

        const amountHTML = document.querySelector('#amount')
        amountHTML.textContent = amount.toLocaleString('pt-br', {
            style: 'currency',
            currency: 'BRL'
        })
        
    }
})
