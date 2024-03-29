
/****************************************
 *  DESKTOP main_d.js                   *
 ****************************************/

var player,videoElement;
var threshold = 50;
var keysEnabled = true;
var videoStatus = {};
var timer;  
var timeron = false;
var noiseon = true;
var DEBUG = false;
var copyLink = "CLICK HERE FOR MORE INFORMATION & TICKETS";
var playing;

//var defaultQuality = 'hd720'; // check qualities available

/**
 * Start page defines the start of the application. It gets the videos from
 * the backend, creates the loader and starts the loader of the player.
 */

function startApp() {
    if(DEBUG) {
        console.log("Page ready...");
    }
    // Add loader
    $('#container').append('<div id="loader"><img src="imgs/loader.gif">LOADING</div>');

    // Add Event Handlers
    $(window).focus(function() {
        if(DEBUG) {
            console.log("Window has focus");
        }
    });
    
    $(window).resize(function () { 
        positionNoise();
    });
    
    $(document).keypress(function (e){ 
        var currVideo = player.getPlaylistIndex();
        var totalVideos = videosDesktop.length-1;
        if(DEBUG) {
            console.log(e);
        }
        
        var key;
        if ( $.browser.msie ) {  // if IE it uses keyCode instead of charcode
            key = e.keyCode;
        } else {
            key = e.charCode; // all other (Safari, Chrome, Firefox) use charCode
        }
        if(keysEnabled) {
            if(key == 32) {
                if( currVideo == totalVideos) { // last video
                    player.playVideoAt(1);
                } else {
                    player.nextVideo();
                }
            }
        } else {
            if(DEBUG){
                console.log("detectKey(e) :: keys are disabled at this point");
            }
        } 
    });
    
    // Start Noise
    loadNoiseVideo(); // Load Noise Video
}

/**
 * Called by the playlist ready function of the player.
 * Loads the noise video, when it's loaded it adds it to the DOM
 * positions and resizes the noise on the callback.
 */                                                                                                                                                                                                                                                                                
function loadNoiseVideo() {
    if(DEBUG) {
        console.log("loadNoiseVideo() :: Loading Noise...");
    }
    var noiseImage = new Image(); 
    noiseImage.src = "imgs/noise.gif";
    
    noiseImage.onload = function () { 
        noiseLoaded(noiseImage);
    };
    
}

function noiseLoaded(noiseImage) {
    
    // Add Noise & Link
    $('#container').append('<div id="video-container"></div>');
    $("#container").append('<div id="link-container">'+copyLink+'</div>');
    $("#container").append('<div id="transparent"></div>');
    $('#video-container').append(noiseImage);
    
    positionNoise();
    
    // Adding Link Handle
    $("#link-container").click(function() {
        player.pauseVideo();
        
        // Open link in new window
        $(this).target = "_blank";
        window.open("/r");
        return false; 
    });
    
    
    $("#loader").remove();    
    $("#video-container").css("opacity","1");
    
    // Loading Playlist
    if(DEBUG) {
        console.log("noiseLoaded() :: Noise Loaded! Loading playlist");
    }
    
    //  Load Player
    loadPlayer(); 
}

/**
 * This set of functions load the player and inject it into the DOM. Player
 * is loaded by loadPlayer() function. With the callback onPlayerReady(). On player
 * ready it positions and resizes the player to windowwith and waits 100ms to cue a playlist.
 */
 
function loadPlayer() {
    if(DEBUG){
        console.log("loadPlayer() :: Loading Player ...");
    }
    
    $("#container").append('<div id="player"></div>');
    $("#player").css("opacity","0");
    
    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
}

function onPlayerReady(event) {
    if(DEBUG) {
        console.log("onPlayerReady(e) :: Calling noise and cueing playlist...",videosDesktop);
    }
    
    // Cue playlist and play first video
    player.cuePlaylist(videosDesktop);
    $("#player").css("opacity","1");
    startCheck(); // start timer to check if it its really playing
}

function onPlayerError(event) {
    if(DEBUG) {
        console.log("onPlayerError() :: Error",event);
    }
}

function onYouTubeIframeAPIReady() {    
    
    if(DEBUG) {
        console.log("onYouTubeIframeAPIReady() :: IframeAPIReady...");
    }
    
    player = new YT.Player('player', {  
        playerVars: {
            'autoplay' : 1,
            'controls': 0,
            'showinfo' : 0,
            'wmode' : 'opaque',
            'modestbranding' : 1,
            'disablekb' : 1,
            'enablejsapi': 1,
            'iv_load_policy' : 3,
            'origin': window.location.host,
            'rel' : 0
        },    
        events: {
            'onReady': onPlayerReady,
            'onStateChange' : onytplayerStateChange
        },
        width : '100%',
        height : '100%',
        videoId : videosDesktop[0]
  });
}


/**
 * This set of functions control the noise in relation to the video.
 * it activates the noise if the video starts playing and hasn't reached 1-2 seconds before end
 * it deatctivates the noise once the video has reached 2 seconds prior to end ofthe film.
 */
 
function checkPlay() {
    
    if(DEBUG) {
        console.log("checkPlay() :: CurrentVideo:",player.getPlaylistIndex(),"CurrentTime:",player.getCurrentTime(),"Totaltime",player.getDuration());
    }
    
    if(player.getCurrentTime() > 0.5 && player.getCurrentTime() < player.getDuration() -  1 && player.getPlayerState() == 1) { // duration values have to be the same
        hideNoise();
    }
    if(player.getCurrentTime() != 0.5 && player.getCurrentTime() > player.getDuration() - 1 ) { // duration values have to be the same
        showNoise();
    }
}

function showNoise() {
    if(!noiseon) {
        if(DEBUG) {
            console.log("showNoise() :: Noise fadein...");
        }
        $("#link-container").css("visibility","hidden");
        $("#video-container").fadeIn('fast'); // fadeout noise
        noiseon = true;
    }
}

function hideNoise() {
    if(noiseon) {
        if(DEBUG) {
            console.log("hidenoise() :: Noise fadeout...");
        }
        $("#link-container").css("visibility","visible");
        $("#video-container").fadeOut('fast'); // fadeout noise
        noiseon = false;
    }
}

function startCheck() {
    if(DEBUG) {
        console.log("startCheck() :: Starting Timer");
    }
    if(!timeron) {
        timer = setInterval('checkPlay()',500);
    }
    timeron = true;
}


function stopCheck() {
    if(timeron) {
        clearInterval(timer);
        timeron = false;   
        
        if(DEBUG) { 
            console.log("stopCheck() :: Stopping Timer");
        }
        $("#video-container").fadeOut(); // fadeout noise
    }
}

function restartPlaylist() {
    if(DEBUG) {
        console.log("restartPlaylist() :: restarting playlist ...");
    }
    player.playVideoAt(1); // play second video on restart playlist
    videoStatus = {};
}

/**
 * State change calls from YT I Frame API
 */
 
function onytplayerStateChange(newState) {   
   switch (newState.data) {
        case 0:
            if(DEBUG) {
                console.log("onytplayerStateChange() :: State",newState.data,"End Playlist");
            }
            //stopCheck();
            restartPlaylist();
            window.focus();
            break;
        case 1:
            if(DEBUG) {
                console.log("onytplayerStateChange() :: State",newState.data,"Playing");
                console.log("Playing........",player.getPlaylistIndex());
            }
            keysEnabled = true; // enable keys back
            window.focus();
            break;
        case -1:
            if(DEBUG) {
                console.log("onytplayerStateChange() :: State",newState.data,"Unstarted");
                console.log("onytplayerStateChange(): Availible:", player.getAvailableQualityLevels(),"Decided:", player.getPlaybackQuality());
            }
            //player.setPlaybackQuality(defaultQuality);
            showNoise();  
            window.focus();
            keysEnabled = false; // disable ketys on static noise
            break;
        case 2:
            if(DEBUG) {
                console.log("onytplayerStateChange() :: State",newState.data,"Paused");            
            }
            window.focus();
            break;
        case 3:
            if(DEBUG) {
                console.log("onytplayerStateChange() :: State",newState.data, "Buffering");
            }
            break;
   }
}

/**
 * Utility belt, all resizing functions.
 */
 
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

function positionNoise() {
    
    var windowW = $(window).width();
    var windowH = $(window).height();

    var baseW = 540; // set base noise width
    var baseH = 305; // set base noise height
    
    // Calculate Noise Size
    if(windowW > windowH) { // if window is landscape
        var sizeFactor = windowW / baseW;
        nWidth = baseW * sizeFactor;
        nHeight = nWidth / 1.77;
        if(nHeight > windowH) {
            nWidth = nWidth * windowH/nHeight;
            nHeight = nWidth / 1.77;  
        }
    } 
    
    if (windowW < windowH) {
        var sizeFactor = windowH / baseH;
        nHeight = baseH * sizeFactor;
        nWidth = nHeight * 1.77;
        if(nWidth > windowW) {
            nHeight = nHeight * windowW/nWidth;
            nWidth = nHeight * 1.77;
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
    
    // Position Link
    var l_posX = $(window).width()/2 - $("#link-container").width()/2;
    var l_posY = Math.round(noiseVCenter) + Math.round(nHeight) - 50;    
    $("#link-container").css("top", l_posY + "px");
    $("#link-container").css("left",l_posX + "px");
    
    // Disappear if window is small
     if($(window).width() < 600) {
         $("#link-container").css("opacity","0");
     } else {
         $("#link-container").css("opacity","1");
     }
}

