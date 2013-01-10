
/****************************************
 *  MOBILE  main_m.js                   *
 ****************************************/
var player;

/**
 * Start page defines the start of the application. It gets the videos from
 * the backend, creates the loader and starts the loader of the player.
 */

function startApp() {
    $("#container").append('<div id="header"><img src="../imgs/logo.png"></div>');
    $("#container").append('<div id="content"><div id="player">Video</div><a href="http://www.barbican.org.uk/duchamp/"><img src="../imgs/text.png"></div></a>');
    loadPlayer();

}

/**
 * Start page defines the start of the application. It gets the videos from
 * the backend, creates the loader and starts the loader of the player.
 */
 
function loadPlayer() {    
    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onPlayerReady(event) {
}
function onytplayerStateChange(newState) {
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId : videosMobile[0],            
        events: {
            'onReady': onPlayerReady,
            'onStateChange' : onytplayerStateChange
        },
        
        playerVars: {  
            'autoplay' : 1,
            'controls' : 0,
            'showinfo' : 0,
            'modestbranding' : 0,
            'rel' : 0
    }
    });
}

