(function() {

    let taps = [];
    let sampleWindow;
    let volumeRange = 3;
    let volumeLevel = 0;

    const tapClass = 'tap-bg';
    const tapArea = document.getElementById('tap-area');
    const sampleWindowSlider = document.getElementById('sample-window-slider');
    const sampleWindowLevel = document.getElementById('sample-window-level');
    const bpmEl = document.getElementById('bpm');
    const appContainerEl = document.getElementById('tap-area');
    const AudioContext = (window.AudioContext || window.webkitAudioContext)
    const audioIcon = document.getElementById('volume-level-icon');
    const ctx = new AudioContext;

    tapArea.addEventListener('keydown', handleTap);
    tapArea.addEventListener('touchstart', touchWrapper(handleTap));
    tapArea.addEventListener('click', handleTap);
    sampleWindowSlider.addEventListener('change', handleSampleWindowChange); 

    audioIcon.addEventListener('touchstart', touchWrapper(increaseVolume));
    audioIcon.addEventListener('click', increaseVolume);


    function touchWrapper(fn) {
        return function(e) {
            e.preventDefault();
            fn();
        }
    }

    function init(initSampleWindowLevel) {
        taps = [];
        sampleWindow = initSampleWindowLevel || sampleWindowSlider.value; 
        sampleWindowSlider.value = sampleWindow;
        sampleWindowLevel.innerHTML = sampleWindow; 
        audioIcon.src =  `assets/svg/v${volumeLevel}.svg`;
        bpmEl.innerHTML = 0; 
    }

    function increaseVolume() {
        volumeLevel = (volumeLevel + 1) % volumeRange;
        audioIcon.src = `assets/svg/v${volumeLevel}.svg`;
    }

    function handleTap() {

        showTapEffect();
        playClick();
        if (taps.length < sampleWindow + 1)
            return taps.push(Date.now());

        let deltaMilliseconds = taps[sampleWindow] - taps[0];
        let deltaSeconds = deltaMilliseconds / 1000;
        let tapsPerMinute = (60 * sampleWindow)/deltaSeconds;
        taps.splice(0, taps.length);
        writeToDOM(bpmEl, Math.floor(tapsPerMinute));

        debugLog();

    }

    function handleSampleWindowChange(e) {

        const newValue = parseInt(e.target.value);
        init(newValue);
        debugLog();

    }

    function showTapEffect() {

        appContainerEl.classList.toggle(tapClass);

        setTimeout(function() {
            appContainerEl.classList.toggle(tapClass);
        }, 80);

    }

    function writeToDOM(el, bpm) {
        el.innerHTML = bpm;
    }

    function debugLog() {
        console.log(`
            sampleWindow: ${sampleWindow}
            taps: ${taps.toString()}
        `);
    }

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

    init(4);

}())
