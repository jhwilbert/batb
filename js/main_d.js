/**************************************/
/*          Desktop Version           */
/**************************************/

var player,videoElement;
var threshold = 50;
var keysEnabled = true;
var fullPlaylist = ['qRBrptVex2I','A1oqJiMczCg','G9aDzKZHRxU','P2uMQOBlk60','IvmIk3LCmwc','mYqAzPs6Lx0'];
var videoStatus = {}

/*  StartPage  */

$(document).ready(function() {
    console.log("Page ready...");
    $('#container').append('<div id="loading" class="pages">Loading<img src="imgs/loader.gif"></div>');
    loadNoiseVideo(); // Load Noise Video
});



/* Noise Loader */                                                                                                                                                                                                                                                                                       

function loadNoiseVideo() {
    console.log("Loading Noise...");
    var noiseImage = new Image(); 
    noiseImage.src = "imgs/noise4.gif";
    
    noiseImage.onload = function () {
        console.log("Noise Loaded...");    
        noiseLoaded(noiseImage);
    };
}

function noiseLoaded(noiseImage) {
    $('#container').append('<div id="video-container"></div>');
    $('#video-container').append(noiseImage);
    $(noiseImage).css("width","100%");
    
    //$('#video-container').css("height", noiseImage.height + "px");
    //$('#video-container').css("width", noiseImage.width + "px");    
    var verticalCenter = ($(window).height() / 2) - ($("#video-container").height()/2);
    $("#video-container").css("top",verticalCenter + "px");
    $("#video-container").css("opacity","1");
    
    $("#loading").remove();
    loadPlayer(); // Start YT player
}



/* Playback Detection */

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



/*  YT Player  */

function loadPlayer() {
    console.log("loadPlayer() :: Loading Player...");
    $("#container").append('<div id="player"></div>');
    
    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onPlayerReady(event) {
    console.log("onPlayerReady(e) :: Loading PLaylist...");
    player.loadPlaylist(fullPlaylist,0); // Load playlist
}

function onYouTubeIframeAPIReady() {    
    player = new YT.Player('player', {  
        height: $(window).height(),
        width: $(window).width(),
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
   console.debug(newState.data);
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
            $("#video-container").fadeOut();
            window.focus();
            break;
        case -1:
            console.log("onytplayerStateChange() :: Showing static");
            $("#video-container").fadeIn();
            window.focus();
            break;
        case 2:
            console.log("onytplayerStateChange() :: Paused");
            window.focus();
            break;
        case 3:
            console.log("Youtube Player :: Buffering...")
            break;
   }
}




/* Utilities */

$(window).resize(function () { 
    var verticalCenter = ($(window).height() / 2) - ($("#video-container").height()/2);
    $("#video-container").css("top",verticalCenter + "px");
    //player.setSize($(window).height(),$(window).width());
    /* do something */ 
});

$(window).focus(function() {
    console.log("Window has focus");
});