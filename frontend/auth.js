// send jwt to backend
const sendJwtToBackend = (jwt) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/auth');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ jwt }));
};

// retreive jwt from local storage
const getJwtFromLocalStorage = () => {
    return localStorage.getItem('jwt');
}

// set jwt in local storage
const setJwtInLocalStorage = (jwt) => {
    localStorage.setItem('jwt', jwt);
}

// remove jwt from local storage
const removeJwtFromLocalStorage = () => {
    localStorage.removeItem('jwt');
}

// check if jwt is expired
const isJwtExpired = (jwt) => {
    const decodedJwt = jwtDecode(jwt);
    return decodedJwt.exp < Date.now() / 1000;
}

