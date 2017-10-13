const AudioContext = window.AudioContext;
const ctx = new AudioContext();
const requestAnimationFrame = window.requestAnimationFrame ||
                              window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame ||
                              window.msRequestAnimationFrame;   
const metronomeShaft = document.getElementById('metronome-shaft');

let volumeLevel = 0.5;
let degree = 0; 
let degreeStep = 5;
let start = 0;
let clockwise = true; 
let tempo;
let animationFrameHandle;
let on = false;

document.body.addEventListener('click', toggleAnimationOnOff);

function toggleAnimationOnOff(event) {

    on = !on;
    if (!on)
        cancelAnimationFrame(animationFrameHandle);
    else 
        animationFrameHandle = requestAnimationFrame(moveClockHand);
}

function moveClockHand(timestamp) {

    let direction

    if (!start) 
        start = timestamp;

    if (degree > 53.1 || degree < -53.1) {
        clockwise = !clockwise;
        console.log(timestamp);
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
