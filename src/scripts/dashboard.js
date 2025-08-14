function invalidToken() {
    alert("Token inválido ou expirado. Por favor, faça login novamente.");
    localStorage.removeItem("jwt_token");
    window.location.replace("/login.html");
}

// ======================= API =======================
// route getuser
async function getUser() {
    const token = localStorage.getItem("jwt_token");
    const response = await fetch("/api/getUser", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 401) {
        invalidToken();
        return null;
    }

    const data = await response.json();
    return data;
}

// route getAmounts
async function getAmounts() {
    const token = localStorage.getItem("jwt_token");
    const response = await fetch("/api/getAmounts", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 401) {
        invalidToken();
        return null;
    }

    const data = await response.json();
    return data;
}

//route insertAmount
async function insertAmount(type, value, source, forma_pagamento, description) {
    const token = localStorage.getItem("jwt_token");
    const response = await fetch("/api/insertAmount", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            type: type,
            value: value,
            source: source,
            forma_pagamento: forma_pagamento,
            description: description,
        }),
    });

    if (response.status === 401) {
        invalidToken();
        return null;
    }

    const data = await response.json();
    return data;
}

// ======================== UI ========================
function showAmounts(amounts) {
    let earnings = 0;
    let expenses = 0;

    for (let i = 0; i < amounts.length; i++) {
        if (amounts[i].type === "earn") {
            earnings += amounts[i].value;
        } else {
            expenses += amounts[i].value;
        }
    }

    let total = earnings - expenses;

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
    );
}

function tableTransactions(amounts) {
    const tbodyTransactions = document.querySelector("#tbody-transacoes");
    for (let i = 0; i < amounts.length; i++) {
        const tr = document.createElement("tr");

        if (amounts[i].type === "earn") {
            tr.classList.add("table-success");
        } else {
            tr.classList.add("table-danger");
        }

        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = amounts[i].source;
        tr.append(descriptionCell);

        const valueCell = document.createElement("td");
        valueCell.textContent = amounts[i].value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
        tr.append(valueCell);

        const dateCell = document.createElement("td");
        const date = new Date(amounts[i].created_at);
        dateCell.textContent = date.toLocaleDateString("pt-BR");
        tr.append(dateCell);

        const methodCell = document.createElement("td");
        methodCell.textContent = amounts[i].forma_pagamento;
        tr.append(methodCell);

        tbodyTransactions.append(tr);
    }
}

// ======================= MAIN =======================
getUser().then((data) => {
    if (data) {
        const user = data.user[0];

        document.querySelector("#ola").textContent = `Olá. ${user.name}`;
    }
});

getAmounts().then((data) => {
    if (data) {
        let amounts = data.amounts;

        showAmounts(amounts);

        tableTransactions(amounts);
    }
});

document.querySelector("#btn-add-earning").addEventListener("click", () => {
    Swal.fire({
        title: "Cadastrar Ganho",
        html: `
        <input type="number" id="value" class="form-control mb-2" placeholder="Valor">
        <select id="source" class="form-select mb-2">
          <option selected disabled>Fonte</option>
          <option>Salário</option>
          <option>Freelance</option>
          <option>Outro</option>
        </select>
        <select type="text" id="forma_pagamento" class="form-select mb-2">
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
    });
});

const btnAddExpense = document.querySelector("#btn-add-expense");
