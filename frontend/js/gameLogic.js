const logout = () => {
    makeFetch("/api/auth/logout", {}, "GET",  (data) => {
        if (data.success) {
            // redirect to home page
            window.location.href = '/login';
          } else {
            // display error message
            document.querySelector('.error').innerHTML = data.message;
          }
    });
    return false;
}

const createGameRoom = () => {
    makeFetch("/game/createGame", {
        "opponent": prompt("Enter the username of the opponent")
    }, "POST", (data) => {
        console.log(data);
        if (data.success) {
            window.location.href = "/game/room/" + data.gameId;
        } else alert(data.message);
    });
}