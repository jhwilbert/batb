/**************************************/
/*          Desktop Version           */
/**************************************/

var player,videoElement;
var threshold = 50;
var keysEnabled = true;
var fullPlaylist = ['qRBrptVex2I','A1oqJiMczCg','G9aDzKZHRxU','P2uMQOBlk60','IvmIk3LCmwc','mYqAzPs6Lx0'];
var videoStatus = {}
var vWidth,vHeight,nWidth,nHeight;

var noiseH = 305;
var noiseW = 540;

/*  StartPage  */

$(document).ready(function() {
    
    // Darken Background
    $('body').css("background","black");
    $('body').css("overflow","hidden");
    
    // Check if backend provides list otherwise revert to fallback
    if(videosDesktop.length > 0) {
        console.log("Got data from backend...");
        fullPlaylist = videosDesktop;
    }
    
    console.log("Page ready...");
    $('#container').append('<div id="loader"><img src="imgs/loader.gif">Loading TV</div>');
    var loader = $("#loader");
    centerElement(loader);
    
    positionElements();
    loadPlayer(); // Start YT player
});

/* Noise Loader */                                                                                                                                                                                                                                                                                       
function loadNoiseVideo() {
    console.log("Loading Noise...");
    var noiseImage = new Image(); 
    noiseImage.src = "imgs/noise4.gif";
    
    noiseImage.onload = function () { 
        noiseLoaded(noiseImage);
    };
}

function noiseLoaded(noiseImage) {
    
    $('#container').append('<div id="video-container"></div>');
    $('#video-container').append(noiseImage);
    
    $(noiseImage).css("width",nWidth + "px");
    $(noiseImage).css("height",nHeight + "px");
    
    var noiseVCenter = ($(window).height() / 2) - nHeight/2;
    var noiseHCenter = ($(window).width() / 2) - nWidth/2;
    
    $("#video-container").css("top",noiseVCenter + "px");
    $("#video-container").css("left",noiseHCenter + "px");

    $("#video-container").css("opacity","1");
    
    $("#loader").remove();
    $("#player").css("opacity","1");      
    
    console.log("noiseLoaded() :: Starting to play...");
    player.playVideo();
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
        console.log("detectKey(e) :: keys are disabled at this point");
    }
}


/*  YT Player  */
function loadPlayer() {
    console.log("loadPlayer() :: Loading Player...");
    $("#container").append('<div id="player"></div>');
    $("#player").css("opacity","0");
        
    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onPlayerReady(event) {
    console.log("onPlayerReady(e) :: Loading Noise...");
    player.cuePlaylist(fullPlaylist,0); // Load playlist
}

function endofPlaylist() {
    console.log("endofPlaylist() :: Started Fade...");
    $("#player").remove();
    
    // Add post player and center
    $("#container").append('<div id="post-player">POST PLAYER</div>');
    var postplayer = $("#post-player");
    centerElement(postplayer);
    $("#post-player").fadeIn();
    
}
function onYouTubeIframeAPIReady() {    
    player = new YT.Player('player', {  
        height: vHeight,
        width: vWidth,
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
   console.log(newState.data);
   switch (newState.data) {
        case 0:
            console.log("-------------------------------End of playlist-------------------------------");
            endofPlaylist();
            window.focus();
            break;
        case 1:
            console.log("------------------------------Playing Video-------------------------------",player.getPlaylistIndex());
            console.log("onytplayerStateChange() :: Hiding static");
            storeStatusPlayed();
            keysEnabled = true; // enable keys back
            $("#video-container").fadeOut();
            window.focus();
            break;
        case -1:
            console.log("onytplayerStateChange() :: Showing static");
            $("#video-container").fadeIn();
            window.focus();
            keysEnabled = false; // disable ketys on static noise
            break;
        case 2:
            console.log("onytplayerStateChange() :: Paused");
            window.focus();
            break;
        case 3:
            console.log("onytplayerStateChange() :: Youtube Player :: Buffering...")
            break;
        case 5:
            console.log("onytplayerStateChange() :: Playlist ready...");
            loadNoiseVideo(); // Load Noise Video
            break;
   }
}

/* Utilities */
$(window).resize(function () { 

    //var verticalCenter = ($(window).height() / 2) - ($("#video-container").height()/2);
    //$("#video-container").css("top",verticalCenter + "px");
    //player.setSize($(window).height(),$(window).width());
});

function centerElement(element) {
    var windowW = $(window).width();
    var windowH = $(window).height();
    
    var elementW = $(element).width();
    var elementH = $(element).height();
    
    var centerW = $(window).width()/2 - $(element).width()/2;
    var centerH = $(window).height()/2 - $(element).height()/2;
     
    console.debug(centerW,centerH);
    $(element).css("top",centerH + "px");
    $(element).css("left",centerW + "px");
    
    
}
function positionElements() {
    // Resizing
    var windowW = $(window).width();
    var windowH = $(window).height();
    
    vWidth = windowW;
    vHeight = windowH;

    if(windowW > windowH) {
        console.log("Window Width is bigger","width:",windowW,"height:",windowH);
        nHeight = windowH;
        nWidth = nHeight * 1.77;
        console.log(nHeight,nWidth);
                  
    } else if (windowH > windowW) {
        console.log("Window Height is bigger","width:",windowW,"height:",windowH);
        nWidth = windowW;
        nHeight = nWidth / 1.77;
    }
     
    // Positioning
    var vCenter = ($(window).height() / 2) - vHeight/2;
    var hCenter = ($(window).width() / 2) - vWidth/2;
    
    $("#container").css("top",vCenter + "px");
    $("#container").css("left",hCenter + "px");
}

$(window).focus(function() {
    console.log("Window has focus");
});