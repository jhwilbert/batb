
/****************************************
 *  DESKTOP main_d.js                   *
 ****************************************/

var player,videoElement;
var noiseon = true;
var selectedVideo = 'ry8ORxwoqPo';
var timecodes = [];

/* Debug Settings */
var debug = false;
var controls = 1;

var chapters  = {
   'card1': '00:00',
   'card2' : '00:06',
   'card3' : '00:24',
   'card4' : '00:31',
   'card5' : '00:38',
   'card6' : '00:44',
   'card7' : '01:06',
   'card8' : '01:13',
   'card9' : '01:44',
   'card10' : '01:51',
   'card11' : '02:16',
   'card12' : '02:22',
   'card13' : '02:42',
   'card14' : '02:47',
   'card15' : '02:53',
   'card16' : '03:31',
   'card17' : '03:44',
   'card18' : '03:51'
}


/**
 * Start page defines the start of the application. It gets the videos from
 * the backend, creates the loader and starts the loader of the player.
 */

function startApp() {
    if(debug) {
        console.log("Page ready...");
    }
    // Add loader
    $('#container').append('<div id="loader"><img src="imgs/loader.gif">LOADING</div>');

    // Add Events
    addEvents();
    
    convertTimecodes();
    //  Load Player
    loadPlayer();    
}

/**
 * Search for the next closest clip in video. If it snaps to the last clip and
 * and users press spacebar it will return back to the first clip.
 */

function skipNext() {
    showNoise();
               
    var currentTime = player.getCurrentTime();
    var seekTimecode = higherThan(currentTime,timecodes);
    player.seekTo(seekTimecode,true);
    
    if(debug) {
        console.log("skipNext() :: currentTime:",currentTime,"nextClip:",seekTimecode,"currentIndex");
    }
}

function higherThan(timecode,set) {
    var closest = 0;
    for (var i = 0; i < set.length; i++) {
        var diff = set[i] - timecode;
        if(diff > 0) {
            closest = set[i];
            break;
        }
    }
    return closest;
}

function convertTimecodes() {
   $.each(chapters, function(key,value) {
       timecodes.push(toSeconds(value));
   });
   if(debug) {
       console.log(timecodes);
   }
}

function toSeconds(str) {
   var pieces = str.split(":");
   var result = (Number(pieces[0]) * 60) + Number(pieces[1]);
   //return(result.toFixed(3));
   return(result);
}

/**
 * Called by the playlist ready function of the player.
 * Loads the noise video, when it's loaded it adds it to the DOM
 * positions and resizes the noise on the callback.
 */ 
                                                                                                                                                                                                                                                                                
function loadNoiseVideo() {
    if(debug) {
        console.log("loadNoiseVideo() :: Loading Noise...");
    }
    var noiseImage = new Image(); 
    noiseImage.src = "imgs/noise.gif";
    
    noiseImage.onload = function () { 
        noiseLoaded(noiseImage);
    };
}

function noiseLoaded(noiseImage) {
    
    /* Add Noise & Link */
    $('#container').append('<div id="video-container"></div>');
    $("#container").append('<div id="link-container">CLICK HERE FOR MORE INFORMATION & TICKETS</div>');
    $("#container").append('<div id="transparent"></div>');
    $('#video-container').append(noiseImage);
    
    positionNoise();

    $("#player").css("opacity","1");
    $("#loader").remove();    
    
    /* Loading Playlist */
    if(debug) {
        console.log("noiseLoaded() :: Noise Loaded! Startng to Play...");
    }
    
    /* Start playback */
    player.playVideo();
}

/**
 * This set of functions load the player and inject it into the DOM. Player
 * is loaded by loadPlayer() function. With the callback onPlayerReady(). On player
 * ready it positions and resizes the player to windowwith and waits 100ms to cue a playlist.
 */
 
function loadPlayer() {
    if(debug){
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
    if(debug) {
        console.log("onPlayerReady(e) :: Loading noise...");
    }
    player.pauseVideo(); // pause to start loading
    
    setTimeout(function() {
      loadNoiseVideo();  
    },3000)
    
}

function onYouTubeIframeAPIReady() {    
    if(debug) {
        console.log("onYouTubeIframeAPIReady() :: IframeAPIReady...");
    }
    
    player = new YT.Player('player', {  
        playerVars: {
            'autoplay' : 1,
            'controls': controls,
            'showinfo' : 0,
            'wmode' : 'opaque',
            'modestbranding' : 1,
            'disablekb' : 1,
            'enablejsapi': 1,
            'iv_load_policy' : 3,
            'origin': window.location.host,
            'playlist' : selectedVideo,
            'rel' : 0
        },    
        events: {
            'onReady': onPlayerReady,
            'onStateChange' : onPlayerStateChange
        },
        width : '100%',
        height : '100%',
        videoId : selectedVideo
  });
}

function onPlayerStateChange(newState) {   
    switch (newState.data) {
         case 0:
             if(debug) {
                 console.log("onPlayerStateChange() ::",newState.data,"End");
             }
             showNoise();
             player.playVideoAt(0);
             //window.focus();
             break;
         case 1:
             if(debug) {
                 console.log("onPlayerStateChange() ::",newState.data,"Playing");
             }
             hideNoise();    
             //window.focus();
             break;
         case -1:
             if(debug) {
                 console.log("onPlayerStateChange() ::",newState.data,"Unstarted");
             }
             //window.focus();
             break;
         case 2:
             if(debug) {
                 console.log("onPlayerStateChange() ::",newState.data,"Paused");            
             }
             //window.focus();
             break;
         case 3:
             if(debug) {
                 console.log("onytplayerStateChange() ::",newState.data, "Buffering");
             }
             break;
    }
}
 
/**
 * Noise Control. Switches the noise in and out and hides the link
 */
 
function showNoise() {
    if(!noiseon) {
        if(debug) {
            console.log("showNoise() :: Noise fadein...");
        }
        $("#link-container").css("visibility","hidden");
        $("#video-container").fadeIn('fast'); // fadeout noise
        noiseon = true;
    }
}

function hideNoise() {
    if(noiseon) {
        if(debug) {
            console.log("hidenoise() :: Noise fadeout...");
        }
        $("#link-container").css("visibility","visible");
        
        setTimeout(function() {
            $("#video-container").fadeOut('fast'); // fadeout noise
        },500);
        
        noiseon = false;
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
    
    /* Calculate Noise Size */
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
 
function addEvents() {
    
    /* Link Handle */
    $("#link-container").click(function() {
        $(this).target = "_blank";
        window.open("/r");
        return false; 
    });
    
    /* Focus */
    $(window).focus(function() {
        if(debug) {
            console.log("Window has focus");
        }
    });
    
    /* Resize Window */
    $(window).resize(function () { 
        positionNoise();
    });
    
    /* Spacebar */
    $(document).keypress(function (e){ 
        if(debug) {
            console.log("Keypressed:: calling skipNext()");
        }
        var key;
        
        if ( $.browser.msie ) {  // if IE: keyCode instead of charCode
            key = e.keyCode;
        } else {
            key = e.charCode; // Safari, Chrome, Firefox: charCode
        }

        if(key == 32) {
            skipNext();
        }
    });
}