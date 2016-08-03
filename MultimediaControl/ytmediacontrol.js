var next = null,
    prev = null,
    video = null;

var onPlaying = function(){localStorage.setItem('playing', document.title);};
var onStorage = function(evt){
    key = evt.key;
    if (key == 'playing' && localStorage.playing !== document.title){
        video.pause();
    }
};

function imPlaying(){
    return localStorage.getItem('playing') == document.title;
}

function defineControls(){
    n = document.getElementsByClassName('ytp-next-button');
    p = document.getElementsByClassName('ytp-prev-button');
    v = document.getElementsByTagName('video');
    if (n.length) next = n[n.length-1];
    if (p.length) prev = p[p.length-1];
    if (v.length) {
        video = v[v.length-1];
        video.onplaying = onPlaying;
    }
}

function Next(){
    try { if (imPlaying()) next.click(); }
    catch(err) { // next probably hasn't been defined as a button.
        defineControls();
        Next();
    }
}

function Previous(){
    try { if (imPlaying()) prev.click(); }
    catch(err){ // prev probably hasn't been defined as a button.
        defineControls();
        Previous();
    }
}

function PausePlay(state){
    try { 
        if (state && video.paused && imPlaying())   video.play();  // If "play" command and it isn't playing: play.
        else if (!state && !video.paused)           video.pause(); // And viceversa.
    }
    catch (err) { // video probably hasn't been defined as a video element.
        defineControls();
        PausePlay(state);
    }
}

function CatchMultimedia(msg){
    cmd = msg.command;
    switch(cmd){
        case "next":
            Next();
            console.log('"Next" command received.')
            break;

        case "prev":
            Previous();
            console.log('"Replay/Previous" command received.')
            break;

        case "play":
            PausePlay(1);
            console.log('"Play" command received.')
            break;

        case "pause":
            PausePlay(0);
            console.log('"Pause" command received.')
            break;
    }
}

defineControls();
window.addEventListener('storage', onStorage);
var port = chrome.runtime.connect({name: "ytcontrol"});
port.onMessage.addListener( CatchMultimedia );