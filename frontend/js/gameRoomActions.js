const placeBlack = (x, y, turn, gameId) => {
    makeFetch('/game/placeBlack', {x, y, turn, gameId}, 'POST', (data) => {
        console.log(data);
        if (!data.success) alert(data.message);
        window.location.reload();
    });
}

const performJump = (x, y, turn, gameId) => {
    makeFetch('/game/performJump', {x, y, turn, gameId}, 'POST', (data) => {
        if (!data.success) alert(data.message);
        window.location.reload();
    });
}