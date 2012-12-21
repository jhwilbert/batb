/****************************************
 *  MOBILE  main_m.js                   *
 ****************************************/
var player;

/**
 * Start page defines the start of the application. It gets the videos from
 * the backend, creates the loader and starts the loader of the player.
 */
 
$(document).ready(function() {
    console.log("Page ready...");
    //loadPlayer(); // Load Player
    loadPrepage();
});

function loadPrepage() {
    $("#container").append('<div id="pre-player" class="page">PRE PAGE</div>');
    $("#pre-player").click(function() {
        $("#pre-player").remove();
        loadPlayer(); 
    });
}

/**
 * Start page defines the start of the application. It gets the videos from
 * the backend, creates the loader and starts the loader of the player.
 */
 
function loadPlayer() {
    if(videosMobile.length > 0) {
        console.debug("Got data from backend");
        fullPlaylist = videosMobile;
    }
    
    $("#container").append('<div id="player"></div>');
    $("#player").css("display","none");
    
    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onPlayerReady(event) {
    $("#player").css("display","block");
    player.loadVideoById(videosMobile[0],0); // Load Video
    player.playVideo();
}

function onYouTubeIframeAPIReady() {    
    player = new YT.Player('player', {  
        height: $(window).height(),
        width: $(window).width(),
        events: {
            'onReady': onPlayerReady,
            'onStateChange' : onytplayerStateChange,
        },    
        playerVars: {
            controls: '0',
            showinfo : '0',
            modestbranding: '1',
            wmode: 'opaque',
            disablekb: '1'
        }
  });
}

function onytplayerStateChange(newState) {
   var state = newState.data;
   switch (newState.data) {
        case 0:
            console.log("-------------------------------End of playlist-------------------------------");
            $("#player").remove();
            $("#container").append('<div id="post-player" class="page">POST PLAYER</div>');
            $("#post-player").show();
            window.focus();
            break;
    }
}