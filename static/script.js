async function getUserType() {
    const token = window.localStorage.getItem('token');
    if (!token) {
        return 'Unauthenticated';
    }

    const response = await fetch('/api/v1/users/me', {
        method: 'GET',
        headers: new Headers({
            'X-access-token': token
        })
    })

    const data = await response.json();
    if (data.type) {
        return data.type;
    } else {
        return 'Unauthenticated';
    }
}

function showUser() {
    getUserType()
        .then((userType) => {
            if (userType !== 'Unauthenticated') {
                document.getElementById('auth').style.display = 'block';
                document.getElementById('notauth').style.display = 'none';
            }
        })
    showProprietario();
}

function showProprietario() {
    getUserType().then(userType => {
        if (userType !== 'Proprietario') return;
        // Make visible the tags of class Proprietario
        for (let element of document.getElementsByClassName(userType)) {
            element.style.display = 'block';
        }
        // Show user's parkings
        showRents();
    })
}

function deleteRent(rentId) {
    fetch('/api/v2/rents/' + rentId, {
        method: 'DELETE',
        headers: new Headers({
            'X-access-token': window.localStorage.getItem('token')
        })
    })
        .then(async (res) => {
            res = await res.json();
            fetch('/api/v1/parkings/' + res.parkingId, {
                method: 'DELETE',
                headers: new Headers({
                    'X-access-token': window.localStorage.getItem('token')
                })
            })
        })
        .then(() => {
            document.getElementById(rentId).remove();
        })
}

function showRents() {
    // View parkings
    fetch('/api/v2/rents', {
        method: 'GET',
        headers: new Headers({
            'Content-Type': 'application/json',
            'X-access-token': window.localStorage.getItem('token')
        })
    })
        .then(async (res) => {
            let data = await res.json();
            for (let rent of data) {
                fetch('/api/v1/parkings/' + rent.parkingId)
                    .then(async (parking) => {
                        parking = await parking.json();
                        document.getElementById('parkings').innerHTML += `<div id="${rent._id}"></div>`;
                        let parkingElement = document.getElementById(rent._id);
                        parkingElement.innerText = parking.name;
                        parkingElement.innerHTML += ` <button type="button" onclick="deleteRent('${rent._id}')">Elimina</button>`;
                    })
            }
        })
}

function getInfo() {
    fetch('/api/v1/users/me', {
        method: 'GET',
        headers: new Headers({
            'X-access-token': window.localStorage.getItem('token')
        })
    })
        .then(res => {
            return res.json();
        })
        .then(data => {
            console.log(data)
            let info = document.getElementById('info');

            let type = document.createElement('div');
            type.innerText = 'Utente: ' + data.type;
            info.appendChild(type);

            let username = document.createElement('div');
            username.innerText = 'Username: ' + data.username;
            info.appendChild(username);

            let email = document.createElement('input');
            let emaillabel = document.createElement('label');
            email.type = 'text';
            email.value = data.email;
            email.name = 'email';
            emaillabel.for = 'email';
            emaillabel.innerText = 'Email: ';
            info.appendChild(emaillabel);
            info.appendChild(email);
            info.appendChild(document.createElement('br'));

            let password = document.createElement('input');
            let passwordlabel = document.createElement('label');
            password.type = 'password';
            password.placeholder = 'new_password';
            password.name = 'password';
            passwordlabel.for = 'password';
            passwordlabel.innerText = 'Password: ';
            info.appendChild(passwordlabel);
            info.appendChild(password);

            if (data.type === 'Consumer') {
                let credibility = document.createElement('div');
                credibility.innerText = 'Credibility: ' + data.credibility;
                info.appendChild(credibility);
            } else if (data.type === 'Proprietario') {
                let credit = document.createElement('div');
                credit.innerText = 'Credit: ' + data.credit;
                info.appendChild(credit);
            }

            let button = document.createElement('button');
            button.innerText = 'Update profile';
            newdata = { email: email.innerText }
            if (password.value !== '') newdata.password = password.value;
            button.onclick = function() {
                fetch(data.self, {
                    method: 'PATCH',
                    headers: new Headers({
                        'X-access-token': window.localStorage.getItem('token')
                    }),
                    body: JSON.stringify(newdata)
                })
                    .then(async (response) => {
                        let resdata = await response.json();
                        if (resdata.success) alert('Profilo aggiornato');
                        else alert('Si è verificato un errore');
                    })
            }
            info.appendChild(button);
        })
}
