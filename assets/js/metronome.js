const AudioContext = window.AudioContext;
const requestAnimationFrame = window.requestAnimationFrame ||
                              window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame ||
                              window.msRequestAnimationFrame;   

const ctx = new AudioContext();
const volumeLevel = 0.5;
const metronomeShaft = document.getElementById('metronome-shaft');

let degree = 130; 
let degreeStep = 1;
let start = 0;
let interval = 10;
let clockwise = true; 
let tempo;
let animationFrameHandle;
let going = false;

document.body.addEventListener('click', toggleAnimationOnOff);

function toggleAnimationOnOff() {
    going = !going;
    if (!going)
        cancelAnimationFrame(animationFrameHandle);
    else 
        animationFrameHandle = requestAnimationFrame(moveClockHand);
}

function moveClockHand(timestamp) {

    let progress;
    let direction

    if (!start) start = timestamp;
    progress = timestamp - start;

    if (progress > 1000) {
        playClick();
        clockwise = !clockwise;
        start = null;
    }

    direction = clockwise ? 1 : -1;
    degree = (degree + (degreeStep * 1 * direction)) % 360;

    metronomeShaft.style.transform = `rotate(${degree}deg)`;

    animationFrameHandle = requestAnimationFrame(moveClockHand);

};


function playClick() {

    let osc;
    let gain;

    osc = ctx.createOscillator();
    osc.frequency = 1200;

    gain = ctx.createGain();
    gain.gain.value = volumeLevel;

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.stop(ctx.currentTime + 0.06);

}
