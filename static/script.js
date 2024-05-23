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
    return data.type;
}
