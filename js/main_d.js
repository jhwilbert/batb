
/****************************************
 *  DESKTOP main_d.js                   *
 ****************************************/

var player,videoElement;
var threshold = 50;
var keysEnabled = true;
var videoStatus = {};
var loader, postplayer;
var timer;  
var timeron = false;
var noiseon = true;
var ticketsLink = "http://www.barbican.org.uk/artgallery/series.asp?id=1142&utm_campaign=CCOHPF131112B&utm_source=Barbican_Homepage&"
                   + "utm_medium=Flash_Small&utm_content=Flash_on-homepage_%20CCOHPF131112B&utm_nooverride=1"

/**
 * Start page defines the start of the application. It gets the videos from
 * the backend, creates the loader and starts the loader of the player.
 */

$(document).ready(function(){
    
    console.log("Page ready...");
        
    // Add loader
    $('#container').append('<div id="loader"><img src="imgs/loader.gif">Loading TV</div>');
    loader = $("#loader");
    centerElement(loader);
    
    // Start YT player
    loadPlayer(); 
     
});


/**
 * Called by the playlist ready function of the player.
 * Loads the noise video, when it's loaded it adds it to the DOM
 * positions and resizes the noise on the callback.
 */                                                                                                                                                                                                                                                                                
function loadNoiseVideo() {
    console.log("loadNoiseVideo() :: Loading Noise...");
    
    var noiseImage = new Image(); 
    noiseImage.src = "imgs/noise4.gif";
    
    noiseImage.onload = function () { 
        noiseLoaded(noiseImage);
    };
}

function noiseLoaded(noiseImage) {
    
    $('#container').append('<div id="video-container"></div>');
    $('#video-container').append(noiseImage);
    
    positionNoise();
    
    $("#loader").remove();    
    $("#video-container").css("opacity","1");
    $("#player").css("opacity","1");
    
    // Loading Playlist
    console.log("noiseLoaded() :: Noise Loaded! Loading playlist",videosDesktop);
    player.loadPlaylist(videosDesktop);
    
    // Fix bug on chrome not playing the first video
    if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
        player.playVideoAt(0);
    }
    
    
    // Loading Link
    $("#container").append('<div id="link-container">CLICK HERE FOR MORE INFORMATION AND TICKETS</div>');
    positionLink();
    
    // Link Handle
    $("#link-container").click(function() {
        player.pauseVideo();
        
        // Open link in new window
        $(this).target = "_blank";
        window.open(ticketsLink);
        return false;
        
    });

}

/**
 * Detects the video when it's interrupted. And creates an object that stores 
 * The percent watched by the user, if the percent is lower than set in the bar
 * it will take the user to the last video.
 */
 
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
         
    if(videoIndex > 1 && videoIndex  < videosDesktop.length-1) {
        checkWatched(); //check if we need Barbican cards to appear
    } else if (videoIndex < 1) {
        console.log("storeStatus() :: Still Gathering Data");
    } else if (videoIndex == videosDesktop.length-1) {
        console.log("storeStatus() :: Last Video No Storing")
    }
}

function storeStatusPlayed() {
    if(player.getPlaylistIndex() > 0) { 
        var prevVideo = player.getPlaylistIndex()-1;
        if(videoStatus[prevVideo] == undefined && player.getPlaylistIndex() != videosDesktop.length-1) { // Update the video object 100% if it hasn't been interrupted
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
        console.log("checkWatched() :: Overall Percent Watched:", percentWatched," ** SKIPPED TO MUCH ** Play Barbican Card Next", videosDesktop.length-1);
        player.playVideoAt(videosDesktop.length-1);
        
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

/**
 * Interaction Handles
 */

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



/**
 * This set of functions load the player and inject it into the DOM. Player
 * is loaded by loadPlayer() function. With the callback onPlayerReady(). On player
 * ready it positions and resizes the player to windowwith and waits 100ms to cue a playlist.
 */
 
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
    console.log("onPlayerReady(e) :: Calling noise and loading playlist...");
    loadNoiseVideo(); // Load Noise Video
    
    startCheck(); // start timer to check if it its really playing
}

function onYouTubeIframeAPIReady() {    
    player = new YT.Player('player', {  
        events: {
            'onReady': onPlayerReady,
            'onStateChange' : onytplayerStateChange
        },    
        playerVars: {
            'autoplay' : 1,
            'controls': 0,
            'showinfo' : 0,
            'modestbranding' : 1,
            'wmode' : 'opaque',
            'disablekb' : 1,
            'enablejsapi': 1,
            'origin': window.location.host,
            'rel' : 0
        },
        width : '100%',
        height : '100%',
        
  });
}


/**
 * This set of functions control the noise in relation to the video.
 * it activates the noise if the video starts playing and hasn't reached 1-2 seconds before end
 * it deatctivates the noise once the video has reached 2 seconds prior to end ofthe film.
 */
 
function checkPlay() {
    
    console.debug("checkPlay() :: CurrentTime:",player.getCurrentTime(),"Totaltime",player.getDuration());
    
    if(player.getCurrentTime() > 0 && player.getCurrentTime() < player.getDuration() - 0.5) {
        hideNoise();
    }
    if(player.getCurrentTime() != 0 && player.getCurrentTime() > player.getDuration() - 0.5) {
        showNoise();
    }
}

function showNoise() {
    if(!noiseon) {
        console.debug("hidenoise() :: Noise fadein...");
        $("#video-container").fadeIn(); // fadeout noise
        noiseon = true;
    }
}

function hideNoise() {
    if(noiseon) {
        console.debug("hidenoise() :: Noise fadeout...");
        $("#video-container").fadeOut(); // fadeout noise
        noiseon = false;
    }
}

function startCheck() {
    console.debug("startCheck() :: Starting Timer");
    if(!timeron) {
        timer = setInterval('checkPlay()',300);
    }
    timeron = true;
}


function stopCheck() {
    if(timeron) {
        clearInterval(timer);
        timeron = false;    
        console.debug("stopCheck() :: Stopping Timer");
        $("#video-container").fadeOut(); // fadeout noise
    }
}

function restartPlaylist() {
    console.log("restartPlaylist() :: restarting playlist ...");
    player.playVideoAt(0);
    videoStatus = {};
}

/**
 * State change calls from YT I Frame API
 */
 
function onytplayerStateChange(newState) {   
   switch (newState.data) {
        case 0:
            console.log("------------------------------- onytplayerStateChange() :: State",newState.data,"End Playlist -----------------------------");
            //stopCheck();
            restartPlaylist();
            window.focus();
            break;
        case 1:
            console.log("------------------------------- onytplayerStateChange() :: State",newState.data,"Playing ----------------------------------");
            keysEnabled = true; // enable keys back
            console.debug("Playing........",player.getPlaylistIndex());
            window.focus();
            break;
        case -1:
            
            console.log("------------------------------- onytplayerStateChange() :: State",newState.data,"Unstarted -------------------------------");
            showNoise();
            player.setPlaybackQuality('hd720');
            console.log("onytplayerStateChange(): Availible:", player.getAvailableQualityLevels(),"Decided:", player.getPlaybackQuality());
            
            window.focus();
            paused = true; // enable pause
            keysEnabled = false; // disable ketys on static noise
            break;
        case 2:
            console.log("------------------------------- onytplayerStateChange() :: State",newState.data,"Paused ----------------------------------");            
            window.focus();
            break;
        case 3:
            console.log("------------------------------- onytplayerStateChange() :: State",newState.data, "Buffering -------------------------------");
            break;
   }
}

/**
 * Utility belt, all resizing functions.
 */

$(window).resize(function () { 
    centerElement(postplayer);
    centerElement(loader);
    
    positionLink();
    positionPlayer();
    positionNoise();
});

function centerElement(element) {
    
    var windowW = $(window).width();
    var windowH = $(window).height();
    
    var elementW = $(element).width();
    var elementH = $(element).height();
    
    var centerW = $(window).width()/2 - $(element).width()/2;
    var centerH = $(window).height()/2 - $(element).height()/2;
     
    $(element).css("top",centerH + "px");
    $(element).css("left",centerW + "px");
}

function positionPlayer() {
    // Window size
    var windowW = $(window).width();
    var windowH = $(window).height();
    
    // Set Player Size
    player.setSize(windowW,windowH); 
}

function positionLink() {
    var windowW = $(window).width();
    var noiseH = $("#video-container").height();
    var noiseX = $("#video-container").position();
    
    var elementW = $("#link-container").width();
    var centerW = $(window).width()/2 - $("#link-container").width()/2;
    
    // Disappear if window is small
    if(windowW < 600) {
        $("#link-container").css("opacity","0");
    } else {
        $("#link-container").css("opacity","1");
    }
    
    
    $("#link-container").css("top", ((noiseH + noiseX.top) - 50) + "px");     
    $("#link-container").css("left",centerW + "px");
}

function positionNoise() {
    var windowW = $(window).width();
    var windowH = $(window).height();
    
    var vWidth = windowW; // set video width
    var vHeight = windowH; // set video height
    
    var baseW = 540; // set base noise width
    var baseH = 305; // set base noise height
    
    // Calculate Noise Size
    if(windowW > windowH) {
        //console.log("positionNoise() :: Landscape View :: use width to measure");
        var sizeFactor = windowW / baseW;
        nWidth = baseW * sizeFactor;
        nHeight = nWidth / 1.77;
        if(nHeight > windowH) {
            console.log("positionNoise() ::  won't fit vertically resize again",windowH/nHeight);
            nWidth = nWidth * windowH/nHeight;        
        }
    } 
    
    if (windowW < windowH) {
        //console.log("Portrait View :: use height to measure");
        var sizeFactor = windowH / baseH;
        nHeight = baseH * sizeFactor;
        nWidth = nHeight * 1.77;
        if(nWidth > windowW) {
            //console.log("positionNoise() :: Won't fit horizontally resize again",windowW/nWidth);
            nHeight = nHeight * windowW/nWidth;
        } 
    }
    
    // Set Noise Size
    var noiseImage = $("#video-container").find('img');
    var noiseVCenter = ($(window).height() / 2) - nHeight/2;
    var noiseHCenter = ($(window).width() / 2) - nWidth/2;
    
    $(noiseImage).css("width",Math.round(nWidth) + "px");
    $(noiseImage).css("height",Math.round(nHeight) + "px");
    
    $("#video-container").css("top",Math.round(noiseVCenter) + "px");
    $("#video-container").css("left",Math.round(noiseHCenter) + "px");
    
}

$(window).focus(function() {
    console.log("Window has focus");
});