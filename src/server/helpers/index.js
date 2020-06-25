function rand() {
    return Math.random().toString(36).substr(2); // remove `0.`
};

export function generatetoken() {
    return rand() + rand(); // to make it longer
};

export function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// GAME STEPS
export let WAIT_PLAYERS = 'WAIT_PLAYERS'
export let INIT_GAME = 'INIT_GAME'
export let IN_GAME = 'IN_GAME'
export let IN_PAUSE = 'IN_PAUSE'
export let GAME_OVER = 'GAME_OVER'


// PLAYER STEPS
export let PLAYER_NEW = 'PLAYER_NEW'
export let PLAYER_ALIVE = 'PLAYER_ALIVE'
export let PLAYER_DEAD = 'PLAYER_DEAD'
