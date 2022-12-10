const makeFetch = (url, body, method, callback) => {
    fetch(url, {
        method: method,
        credentials: 'same-origin',
        mode: 'same-origin',
        redirect: 'follow',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: method === "GET" ? null : JSON.stringify(body)
    }).then(response => response.json()).then(data => {
        callback(data);
    }).catch(error => {
        console.error('Error:', error);
    });
}

const getLegalJumps = (board, ballPosition) => {
    
}

