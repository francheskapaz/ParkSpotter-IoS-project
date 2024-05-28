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
