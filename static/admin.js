// Show users
const users = document.getElementById('users');
fetch('/api/v2/users', {
    headers: new Headers({
        'X-access-token': window.localStorage.getItem('token')
    })
})
    .then(res => {
        return res.json();
    })
    .then(data => {
        for (let user of data) {
            let userdiv = document.createElement('div');
            userdiv.innerText = user.email + ' ';
            users.appendChild(userdiv);

            let button = document.createElement('button');
            button.innerText = 'Delete';
            button.onclick = function() {
                fetch('/api/v2/users/' + user._id, {
                    method: 'DELETE',
                    headers: new Headers({
                        'X-access-token': window.localStorage.getItem('token')
                    })
                })
                    .then(async (response) => {
                        let resdata = await response.json();
                        if (resdata.success) {
                            alert('Utente eliminato');
                            userdiv.remove();
                        } else {
                            alert('Si è verificato un errore');
                        }
                    })
            }
            userdiv.appendChild(button);
        }
    })

// Show parkings
const parkings = document.getElementById('parkings');
fetch('/api/v1/parkings')
    .then(res => {
        return res.json();
    })
    .then(data => {
        for (let parking of data) {
            console.log(parking)
            let parkingdiv = document.createElement('div');
            parkingdiv.innerText = `${parking.name} (${parking.vehicleType}) `;
            parkings.appendChild(parkingdiv);

            let button = document.createElement('button');
            button.innerText = 'Delete';
            button.onclick = function() {
                fetch('/api/v1/parkings/' + parking._id, {
                    method: 'DELETE',
                    headers: new Headers({
                        'X-access-token': window.localStorage.getItem('token')
                    })
                })
                    .then(response => {
                        if (response.status === 200) {
                            alert('Parcheggio eliminato');
                            parkingdiv.remove();
                        } else {
                            alert('Si è verificato un errore');
                        }
                    })
            }
            parkingdiv.appendChild(button);
        }
    })
