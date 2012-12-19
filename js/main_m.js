/**************************************/
/*          Mobile Version            */
/**************************************/

var player;
var videoId = 'A0BzTZMFmT4';
var videoElement;

/***************/
/*  StartPage  */
/***************/

$(document).ready(function() {
    console.log("Page ready...");
    loadPlayer(); // Load Player
});


/***************/
/*  YT Player  */
/***************/

function loadPlayer() {
    console.log("loadPlayer() :: Loading Player...");
    
    $("#container").append('<div id="player"></div>');
    
    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onPlayerReady(event) {
    player.loadVideoById(videoId,0); // Load Video
    player.playVideo();
}

function onYouTubeIframeAPIReady() {    
    player = new YT.Player('player', {  
        height: viewportSize().h,
        width: viewportSize().w,
        events: {
            'onReady': onPlayerReady,
            'onStateChange' : onytplayerStateChange,
            'videoId' : 'u1zgFlCw8Aw'
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
            $("#container").append('<div id="post-layer" class="pages">POST PLAYER</div>');
            $("#post-player").show();
            window.focus();
            break;
    }
}


/************/
/* UTILS    */
/************/


function viewportSize() {
     var viewportwidth;
     var viewportheight;

     if (typeof window.innerWidth != 'undefined') {
          viewportwidth = window.innerWidth,
          viewportheight = window.innerHeight
     } else if (typeof document.documentElement != 'undefined'
         && typeof document.documentElement.clientWidth !=
         'undefined' && document.documentElement.clientWidth != 0)
     {
           viewportwidth = document.documentElement.clientWidth,
           viewportheight = document.documentElement.clientHeight
     } else {
           viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
           viewportheight = document.getElementsByTagName('body')[0].clientHeight
     }
    
    return { w : viewportwidth, h : viewportheight }
}