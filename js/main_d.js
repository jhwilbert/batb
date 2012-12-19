var player;
var fullPlaylist = ['qRBrptVex2I','A1oqJiMczCg','G9aDzKZHRxU','P2uMQOBlk60','IvmIk3LCmwc','mYqAzPs6Lx0','qRBrptVex2I','A1oqJiMczCg','G9aDzKZHRxU','P2uMQOBlk60','IvmIk3LCmwc','mYqAzPs6Lx0'];
var selectedRefereers = ["facebook","blogger","localhost"];
var videoElement;
var videoStatus = {}
var threshold = 50;

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
    console.debug("Loading Video...");
    
    $('#container').append('<div id="video-container"></div>');
    
    if (Modernizr.video) {
        $("#video-container").append('<video id="static" width="100%" loop="loop" autobuffer="true">Your browser does not support the video tag.</video>');
        
        if (Modernizr.video.h264) {
            $("#static").append('<source src="../videos_mp4/static5.mp4" type="video/mp4">') ; 
        } else if (Modernizr.video.ogg){
              $("#static").append('<source src="../videos_ogg/static5_low.ogg" type="video/ogg">');           
        }
    } else {
        alert("This browser doensn't support HTML5 video");
    }
    
    videoElement = document.getElementById("static");
    videoElement.addEventListener('canplaythrough',playVideo,false);
    
}


function playVideo() {
    console.debug("Video Loaded....",videoElement);
    
    videoElement.removeEventListener('canplaythrough',playVideo);
    $("#loading").remove();
    videoElement.play();
    
    $("#video-container").css("opacity","1");
    
    // Load Playlist tart Playing videos
    player.loadPlaylist(fullPlaylist,0);
    $("#player").css("opacity","1");
}

/***********************/
/*  Refereer Deection  */
/***********************/

function checkRefereer() {
    if(document.referrer != "" && refereerListed()) {
        console.log("Page has refeer and is listed - return...");
        displayMessage("The user is coming from a listed refereer");
        return 1;
    } else if (document.referrer != "" && !refereerListed()) {
        console.log("Page has refeer and is not listed...",document.referrer);
    } else {
        console.log("Page has no refreeer...");
    }    
    return 0;
}

function refereerListed() {
    var foundReferee;
    for(var i=0; i< selectedRefereers.length; i++) {
        if(document.referrer.indexOf(selectedRefereers[i]) != -1) {
            foundReferee =  selectedRefereers[i];
            return true
            break;
        }
    }
    return false;
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
        console.log("checkWatched() :: Overall Percent Watched:",percentWatched,"All Good, let's keep playing videos");
        
    } else {
        console.log("checkWatched() :: Overall Percent Watched:", percentWatched,"Emergency, we need a barbican card");
        displayMessage("Play Barbican Card Next");
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
    if(e.charCode == 32) {
        player.nextVideo();
        videoInterrupted(player.getDuration(),player.getCurrentTime())
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
   debugMsg(state);   
   
   switch (newState.data) {
        case 0:
            console.log("-------------------------------End of playlist-------------------------------");
            $("#player").remove();
            $("#container").append('<div id="post-layer" class="pages">POST PLAYER</div>');
            $("#post-player").show();
            
            window.focus();
            break;
        case 1:
            console.log("onytplayerStateChange() :: Hiding static");
            debugMsg("Playing",state);
            console.log("------------------------------Playing Video-------------------------------",player.getPlaylistIndex());
            storeStatusPlayed();
            $("#video-container").hide();
            window.focus();
            break;
        case -1:
            console.log("onytplayerStateChange() :: Showing static");
            $("#video-container").show();
            debugMsg("Unstarted",state);
            window.focus();
            break;
        case 2:
            console.log("onytplayerStateChange() :: Paused");
            debugMsg("Paused",state);
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

function debugMsg(msg) {
    $("#state").html(msg);
}

function displayMessage(msg) {
    $("#message").html(msg)
    $("#message").css("display","block");
    setTimeout(function() {
        $("#message").css("display","none");
        
    },2000);
}

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