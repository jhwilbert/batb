
/****************************************
 *  MOBILE  main_m.js                   *
 ****************************************/
var player;
var content_pre = "click above to watch the trailer and";
var content_post = "Post page content.";
var defaultQuality = 'hd720'
/**
 * Start page defines the start of the application. It gets the videos from
 * the backend, creates the loader and starts the loader of the player.
 */

function startApp() {
    $("#container").append('');
    $("#container").html('<div id="header"><img src="../imgs/logo.png"></div><div id="player"></div><div id="content">'+content_pre+'</div><div id="button"><a href="http://www.barbican.org.uk/duchamp/">here for more info</a></div>');

    // https://gist.github.com/4438876 // load custom poster frame
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
     $("#player").css("display","block");
     player.setPlaybackQuality(defaultQuality);
}


function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId : videosMobile[0],
        playerVars: {  
            'autoplay' : 1,
            'controls' : 0,
            'showinfo' : 0,
            'modestbranding' : 0,
            'rel' : 0
        }, 
        width: "100%",
        events: {
            'onReady': onPlayerReady,
            'onStateChange' : onytplayerStateChange,
        }
    });
}

function showPostPage() {
    $("#content").html(content_post+'<div id="button"><a href="http://www.barbican.org.uk/duchamp/">PURCHASE TICKETS</a></div>');
}

function onytplayerStateChange(newState) {
   var state = newState.data;
   switch (newState.data) {
        case 0:
            //showPostPage();
            break;
        case -1:
             player.setPlaybackQuality(defaultQuality);
             break;
            
    }
}
