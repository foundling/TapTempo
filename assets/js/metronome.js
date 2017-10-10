const metronomeShaft = document.getElementById('metronome-shaft');
// use requestAnimationFrame.

let tickInterval = setInterval(rotateCW, 10);
let directionInterval = setInterval(changeDirections, 500);
let cw = true;
let degree = 0;

function changeDirections() {
    clearInterval(tickInterval);
    cw = !cw;
    if (cw) {
        tickInterval = setInterval(rotateCW, 10);
    } else {
        tickInterval = setInterval(rotateCCW, 10);
    }
}

function rotateCW() {
    degree = (degree + 1) % 360;
    metronomeShaft.style.transform = `rotate(${degree}deg)`;
}

function rotateCCW() {
    degree = (degree - 1) % 360;
    metronomeShaft.style.transform = `rotate(${degree}deg)`;
}
