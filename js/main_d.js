var player;
var fullPlaylist = ['qRBrptVex2I','A1oqJiMczCg','G9aDzKZHRxU','P2uMQOBlk60','IvmIk3LCmwc','mYqAzPs6Lx0'];
var videoElement;
var videoStatus = {}
var threshold = 50;
var keysEnabled = true;

/***************/
/*  StartPage  */
/***************/

$(document).ready(function() {
    console.log("Page ready...");
    $('#container').append('<div id="loading" class="pages">Loading<img src="imgs/loader.gif"></div>');
    loadPlayer(); // Start YT player
});

/***************/
/* Video Loader */
/***************/
                                                                                                                                                                                                                                                                                       
function loadNoiseVideo() {
    console.log("Loading Noise...");
    var noiseImage = new Image(); 
    noiseImage.src = "imgs/noise.gif";
    
    noiseImage.onload = function () {
        console.log("Noise Loaded...");    
        noiseLoaded();
    };
}

function noiseLoaded() {
    $('#container').append('<div id="video-container"></div>')
    $('#video-container').append('<img width="100%" src="imgs/noise.gif">');
    
    player.loadPlaylist(fullPlaylist,0); // Load playlist
    
    $("#video-container").css("opacity","1");
    $("#player").css("opacity","1");
    $("#loading").remove();
}
/***********************/
/* Playback Detection */
/***********************/

function videoInterrupted(duration,currentTime) {
    if(duration != 0 && currentTime !=0) {
        var percentPlayed = Math.round((currentTime/duration) * 100);
        var videoIndex = player.getPlaylistIndex();
        console.log("videoInterrupted() :: Duration:",duration,"CurrentTime:",currentTime,"PercentPlayed",percentPlayed + "%","video index",player.getPlaylistIndex());
        storeStatus(videoIndex,percentPlayed)
    } else {
        console.log("videoInterrupted() :: Film hasn't started",duration,currentTime);
    }
}

function storeStatus(videoIndex,percentPlayed) {
    videoStatus[videoIndex] = percentPlayed;
    console.log("storeStatus() ::", videoStatus);
         
    if(videoIndex > 1 ) {
        checkWatched(); //check if we need Barbican cards to appear
    } else {
        console.log("storeStatus() :: Still Gathering Data");
    }
}

function storeStatusPlayed() {
    if(player.getPlaylistIndex() > 0) { 
        var prevVideo = player.getPlaylistIndex()-1;
        if(videoStatus[prevVideo] == undefined) { // Update the video object 100% if it hasn't been interrupted
            console.log("storeStatusPlayed() :: Previous Played fully");
            storeStatus(prevVideo,100);
        }
    }
}

function checkWatched() {
    var percentWatched = Math.round(updateTotalPercent());
    if ( percentWatched > threshold) {
        console.log("checkWatched() :: Overall Percent Watched:", percentWatched,"All Good, let's keep playing videos");
    } else {
        console.log("checkWatched() :: Overall Percent Watched:", percentWatched," ** EMERGENCY ** Play Barbican Card Next", fullPlaylist.length-1);
        keysEnabled = false;
        player.playVideoAt(fullPlaylist.length-1);
    
    }
}

function updateTotalPercent() {
    var totalPercent = 0;
    var numItems = 0;
    $.each(videoStatus,function(index,content) {
        totalPercent += content;
        numItems++;
    });
    return totalPercent/numItems;
}

function detectKey(e) {
    e.preventDefault();
    
    if(keysEnabled) {
        if(e.charCode == 32) {
            player.nextVideo();
            videoInterrupted(player.getDuration(),player.getCurrentTime())
        }
    } else {
        console.debug("detectKey(e) :: keys are disabled at this point");
    }
}

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
    console.log("onPlayerReady(e) :: Player ready...");
    loadNoiseVideo(); // Load Noise Video
}

function onYouTubeIframeAPIReady() {    
    player = new YT.Player('player', {  
        height: viewportSize().h,
        width: viewportSize().w,
        events: {
            'onReady': onPlayerReady,
            'onStateChange' : onytplayerStateChange
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
        case 1:
            console.log("------------------------------Playing Video-------------------------------",player.getPlaylistIndex());
            console.log("onytplayerStateChange() :: Hiding static");
            storeStatusPlayed();
            
            setTimeout(function() {
                $("#video-container").hide();
            },200);
            window.focus();
            break;
        case -1:
            console.log("onytplayerStateChange() :: Showing static");
            $("#video-container").show();
            window.focus();
            break;
        case 2:
            console.log("onytplayerStateChange() :: Paused");
            window.focus();
            break;
   }
}

/************/
/* UTILS    */
/************/

$(window).focus(function() {
    console.log("Window has focus");
});

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