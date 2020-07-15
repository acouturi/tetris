function rand() {
    return Math.random().toString(36).substr(2); // remove `0.`
};

export function generatetoken() {
    return rand() + rand(); // to make it longer
};

export function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
