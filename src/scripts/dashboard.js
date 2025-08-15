// ===================== UTILS =========================
function invalidToken() {
    alert("Token inválido ou expirado. Por favor, faça login novamente.")
    localStorage.removeItem("jwt_token")
    window.location.replace("/login.html")
}

async function fetchApi(url, options = {}){
    const token = localStorage.getItem("jwt_token")
    
    const headers = {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
        ...options.headers
    }

    const response = await fetch(url, {
        ...options,
        headers
    })

    if (response.status === 401){
        invalidToken()
        return null
    }

    return response.json()
}

// ======================= API =======================
// route getuser
async function getUser() {
    return await fetchApi('/api/getUser', {
        method: 'GET'
    })
}

// route getAmounts
async function getAmounts() {
    return await fetchApi('/api/getAmounts', {
        method: 'GET'
    })
}

//route insertAmount
async function insertAmount(type, value, source, paymentMethod, description) {
    return await fetchApi('/api/insertAmount', {
        method: 'POST',
        body: JSON.stringify({
            type: type,
            value: value,
            source: source,
            paymentMethod: paymentMethod,
            description: description,
        })
    })
}

// ======================== UI ========================
function showAmounts(amounts) {
    let earnings = 0
    let expenses = 0

    for (let i = 0; i < amounts.length; i++) {
        if (amounts[i].type === "earn") {
            earnings += amounts[i].value
        } else {
            expenses += amounts[i].value
        }
    }

    let total = earnings - expenses

    document.querySelector("#amount").textContent = total.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL",
        },
    );

    document.querySelector("#earnings").textContent = earnings.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL",
        },
    );

    document.querySelector("#expenses").textContent = expenses.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL",
        },
    )
}

function tableTransactions(amounts) {
    const tbodyTransactions = document.querySelector("#tbody-transacoes")
    tbodyTransactions.innerHTML = ""

    amounts.forEach(({type, source, value, created_at, payment_method}) => {
        const tr = document.createElement("tr")
        tr.classList.add(type === 'earn' ? 'table-success' : 'table-danger')

        tr.innerHTML = `
            <td>${source}</td>
            <td>${value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
            <td>${new Date(created_at).toLocaleDateString("pt-BR")}</td>
            <td>${payment_method}</td>
        `
        
        tbodyTransactions.appendChild(tr)
    })
}

async function refreshAmounts(){
    const data = await getAmounts()

    if (data){
        let amounts = data.amounts

        showAmounts(amounts)

        tableTransactions(amounts)
    }
}

function openAmountRegistration(type){
    const title = type === 'earn' ? 'Cadastrar Ganho' : 'Cadastrar Despesa'

    Swal.fire({
        title: title,
        html: `
        <input type="number" id="value" class="form-control mb-2" placeholder="Valor">
        <select id="source" class="form-select mb-2">
          <option selected disabled>Fonte</option>
          <option>Salário</option>
          <option>Freelance</option>
          <option>Outro</option>
        </select>
        <select type="text" id="paymentMethod" class="form-select mb-2">
          <option selected disabled>Forma de Pagamento</option>
          <option>Pix</option>
          <option>Crédito</option>
          <option>Débito</option>
          <option>Boleto</option>
        </select>
        <textarea id="description" class="form-control" placeholder="Descrição"></textarea>
      `,
        showCancelButton: true,
        confirmButtonText: "Cadastrar",
        cancelButtonText: "Cancelar",
        customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-secondary ms-2",
        },
        buttonsStyling: false,
    }).then((result) => {
        if(result.isConfirmed){
            const value = parseFloat(document.querySelector('#value').value)
            const source = document.querySelector('#source').value
            const paymentMethod = document.querySelector('#paymentMethod').value
            const description = document.querySelector('#description').value
            
            if (!value || !source || !paymentMethod) {
                Swal.fire("Erro", "Preencha todos os campos obrigatórios.", "error");
                return
            }

            insertAmount(type, value, source, paymentMethod, description).then((data) => {
                if (data && data.message === 'Amount inserted successfully.') {
                    Swal.fire({
                        icon: 'success',
                        customClass: {
                            confirmButton: 'btn btn-primary'
                        }
                    })

                    refreshAmounts()
                }else{
                    Swal.fire({
                        icon: 'error',
                        customClass: {
                            confirmButton: 'btn btn-primary'
                        }
                    })
                }
            })
            
        }
    })
}

// ======================= MAIN =======================
getUser().then((data) => {
    if (data) {
        const user = data.user[0]

        document.querySelector("#ola").textContent = `Olá. ${user.name}`
    }
});

refreshAmounts()

document.querySelector("#btn-add-earning").addEventListener("click", () => openAmountRegistration('earn'))
document.querySelector("#btn-add-expense").addEventListener("click", () => openAmountRegistration('expense'))

// Dados fake para exemplo — substitua com os reais depois
const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
const ganhos = [1200, 1500, 1700, 1400, 1800, 2000];
const despesas = [800, 900, 1100, 1000, 1200, 1300];

// Gráfico de Linhas
const ctxLine = document.getElementById('lineChart').getContext('2d');
new Chart(ctxLine, {
type: 'line',
data: {
    labels: meses,
    datasets: [
        {
            label: 'Ganhos',
            data: ganhos,
            borderColor: 'green',
            backgroundColor: 'rgba(0, 128, 0, 0.1)',
            tension: 0.3
        },
        {
            label: 'Despesas',
            data: despesas,
            borderColor: 'red',
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            tension: 0.3
        }
    ]
},
options: {
    responsive: true,
    scales: {
        y: {
            beginAtZero: true
        }
    }
}
});

// Gráfico de Pizza
const ctxPie = document.getElementById('pieChart').getContext('2d');
new Chart(ctxPie, {
type: 'pie',
data: {
    labels: ['Entradas', 'Despesas'],
    datasets: [{
        data: [
            ganhos.reduce((a, b) => a + b, 0),
            despesas.reduce((a, b) => a + b, 0)
        ],
        backgroundColor: ['#198754', '#dc3545'],
        hoverOffset: 10
    }]
},
options: {
    responsive: true
}
});