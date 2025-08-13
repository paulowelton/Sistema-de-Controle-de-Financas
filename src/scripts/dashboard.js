function invalidToken(){
    alert('Token inválido ou expirado. Por favor, faça login novamente.')
    localStorage.removeItem('jwt_token')
    window.location.replace('/login.html')
}

// ======================= API =======================
// route getuser
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

// route getAmounts
async function getAmounts(){
    const token = localStorage.getItem('jwt_token')
    const response = await fetch('/api/getAmounts',{
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

// ======================== UI ========================
function showAmounts(amounts){
    let earnings = 0
    let expenses = 0
    
    for(let i=0; i < amounts.length; i++){
        if(amounts[i].type === 'earn'){
            earnings += amounts[i].value
        }else{
            expenses += amounts[i].value
        }
        
    }

    let total = earnings - expenses

    document.querySelector('#amount').textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })

    document.querySelector('#earnings').textContent = earnings.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })
    
    document.querySelector('#expenses').textContent = expenses.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })

    
}

function tableTransactions(amounts){
    const tbodyTransactions = document.querySelector('#tbody-transacoes')
    for(let i=0; i < amounts.length; i++){

        const tr = document.createElement('tr')

        if (amounts[i].type === 'earn'){
            tr.classList.add('table-success')
        }else{
            tr.classList.add('table-danger')
        }

        const descriptionCell = document.createElement('td')
        descriptionCell.textContent = amounts[i].source
        tr.append(descriptionCell)

        const valueCell = document.createElement('td')
        valueCell.textContent = amounts[i].value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
        tr.append(valueCell)

        const dateCell = document.createElement('td')
        const date = new Date(amounts[i].created_at);
        dateCell.textContent = date.toLocaleDateString('pt-BR')
        tr.append(dateCell)

        const methodCell = document.createElement('td')
        methodCell.textContent = amounts[i].forma_pagamento
        tr.append(methodCell)

        tbodyTransactions.append(tr)
    }
}


// ======================= MAIN =======================
getUser().then (data => {
    if(data){
        const user = data.user[0]

        document.querySelector('#ola').textContent = `Olá. ${user.name}`

    }
})

getAmounts().then (data => {
    if(data){
        let amounts = data.amounts

        showAmounts(amounts)
        
        tableTransactions(amounts)
        
    }
})
