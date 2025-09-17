// ======================= VARIABLES =======================
let filter = 'all'

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

    amounts.forEach(({type, source, value, created_at, payment_method, description}) => {
        const tr = document.createElement("tr")
        tr.classList.add(type === 'earn' ? 'table-success' : 'table-danger', 'transaction')

        tr.innerHTML = `
            <td>${source}</td>
            <td>${value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
            <td>${new Date(created_at).toLocaleDateString("pt-BR")}</td>
            <td>${payment_method}</td>
            <td style='display:none;'>${description}</td>
            
        `
        
        tbodyTransactions.appendChild(tr)
    })
}

function sourceChart(amounts){
    let sources = []
    let values = []

    amounts.forEach(({source, value}) => {
        sources.push(source)

        values.push(value)
    })

    var data = [{
        type: 'bar',
        x: values,
        y: sources,
        orientation: 'h'
    }]

    var layout = {
        autosize: true,
        margin: { t: 0, b: 0, l: 80, r: 10 }
    }

    var config = {
        responsive: true,
        displayModeBar: false
    }

    Plotly.newPlot(document.querySelector('#bar1'), data, layout, config)
}

function timeBarChart(amounts){
    let dates = []
    let values = []

    amounts.forEach(({value, created_at}) => {
        const data = new Date(created_at)

        dates.push(data.toLocaleDateString('pt-BR'))
        values.push(value)
        
    })

    var data = [{
        x: dates,
        y: values,
        type: 'bar'
    }]

    var layout = {
        autosize: true,
        margin: { t: 30, b: 80, l: 40, r: 20 },
        xaxis: {
            tickangle: -45,
            title: "Fonte"
        },
        yaxis: {
            title: "Valor (R$)"
        }
    }


    var config = {
        responsive: true,
        displayModeBar: false
    }

    Plotly.newPlot(document.querySelector('#bar'), data ,layout, config)
}

async function refreshAmounts(){
    const data = await getAmounts()

    if (data){
        let amounts = data.amounts

        showAmounts(amounts)
        
        if (filter !== 'all'){
            amounts = amounts.filter(amount => amount.type === filter)

            tableTransactions(amounts)

            sourceChart(amounts)

            timeBarChart(amounts)
            
        }else{

        tableTransactions(amounts)

        sourceChart(amounts)

        timeBarChart(amounts)
        
        }

    }
}

function openAmountRegistration() {
  Swal.fire({
    title: 'Selecione o Tipo',
    html: `
      <button id="btn-earn" class="btn btn-primary m-2">Adicionar Ganhos</button>
      <button id="btn-expense" class="btn btn-danger m-2">Adicionar Despesas</button>
    `,
    showConfirmButton: false,
    showCancelButton: true,
    cancelButtonText: 'Fechar',
    buttonsStyling: false,
    customClass: {
      container: 'custom-swal-container',
      cancelButton: 'btn btn-secondary',
    },
    didOpen: () => {
      // Add event listeners to the buttons after the first modal is opened
      document.getElementById('btn-earn').addEventListener('click', () => {
        Swal.close(); // Close the first modal
        openRegistrationForm('earn'); // Open the form for earnings
      });

      document.getElementById('btn-expense').addEventListener('click', () => {
        Swal.close(); // Close the first modal
        openRegistrationForm('expense'); // Open the form for expenses
      });
    }
  });
}

function openRegistrationForm(type) {
  const title = type === 'earn' ? 'Cadastrar Ganho' : 'Cadastrar Despesa';

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
      <select id="paymentMethod" class="form-select mb-2">
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
    preConfirm: () => {
      // Input validation before the form is submitted
      const value = parseFloat(document.querySelector('#value').value);
      const source = document.querySelector('#source').value;
      const paymentMethod = document.querySelector('#paymentMethod').value;
      
      if (!value || isNaN(value) || !source || !paymentMethod || source === 'Fonte' || paymentMethod === 'Forma de Pagamento') {
        Swal.showValidationMessage('Preencha todos os campos obrigatórios.');
        return false;
      }
      
      return {
        value: value,
        source: source,
        paymentMethod: paymentMethod,
        description: document.querySelector('#description').value
      };
    }
  }).then(async (result) => {
    if (result.isConfirmed) {
      const { value, source, paymentMethod, description } = result.value;
      
      try {
        const data = await insertAmount(type, value, source, paymentMethod, description);
        
        if (data && data.message === 'Amount inserted successfully.') {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Dados cadastrados com sucesso.',
            customClass: {
              confirmButton: 'btn btn-primary'
            }
          });
          refreshAmounts();
        } else {
          console.error(data);
          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Ocorreu um erro ao cadastrar os dados.',
            customClass: {
              confirmButton: 'btn btn-primary'
            }
          });
        }
      } catch (error) {
        console.error('Erro na chamada da API:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erro de Conexão!',
          text: 'Não foi possível se conectar ao servidor.',
          customClass: {
            confirmButton: 'btn btn-primary'
          }
        });
      }
    }
  });
}

// ======================= MAIN =======================
getUser().then((data) => {
    if (data) {
        const user = data.user[0]

        document.querySelector("#ola").textContent = `Olá. ${user.name}`
    }
})

refreshAmounts()

document.querySelector(".adicionar").addEventListener("click", () => openAmountRegistration())

document.querySelector("#tbody-transacoes").addEventListener("click", (e) => {
    const tr = e.target.closest("tr.transaction")
    if (!tr) return

    Swal.fire({
        title: 'Detalhes da Transação',
        html: `
            <div class='text-start'>
            <p> <strong>Fonte:</strong> ${tr.children[0].textContent}</p>
            <p> <strong>Valor:</strong> ${tr.children[1].textContent}</p>
            <p> <strong>Data:</strong> ${tr.children[2].textContent}</p>
            <p> <strong>Forma de Pagamento:</strong> ${tr.children[3].textContent}</p>
            <p> <strong>descricao:</strong> ${tr.children[4].textContent}</p>
            </div>
        `,
        customClass: {
            confirmButton: "btn btn-primary",
        }
    })
})

document.querySelector('.filtro').addEventListener('click', () => {
    Swal.fire({
        title: 'Filtro',
        html: `
            <select id="filtro" class="form-select mb-2">
                <option selected disabled>Selecione o filtro</option>
                <option>Ganhos</option>
                <option>Despesas</option>
                <option>Todos</option>
            </select>
        `,
        showCancelButton: true,
        confirmButtonText: "Filtrar",
        cancelButtonText: "Cancelar",
        customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-secondary ms-2",
        },
        // logica para quando clicar no botao de confirmar mudar a variavel filter e chamar a funcao refreshAmounts
        buttonsStyling: false,
    }).then((result) => {
        if (result.isConfirmed){
            const filtro = document.querySelector('#filtro').value
            
            if(filtro === 'Ganhos'){
                filter = 'earn'
                refreshAmounts()
            }
            if(filtro === 'Despesas'){
                filter = 'expense'
                refreshAmounts()
            }
            if(filtro === 'Todos'){
                filter = 'all'
                refreshAmounts()
            }
        }
    })
})







document.querySelector('.log-out').addEventListener('click', () => {
    localStorage.removeItem('jwt_token')

    if (localStorage.getItem('jwt_token') === null){
        alert('Você foi deslogado com sucesso!')
        window.location.replace('/login.html')
    }
    
})