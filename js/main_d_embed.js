var player;
var DEBUG = true;
var noiseon = false;
var timer;  
var timeron = false;
var origin = "http://" + window.location.host;
/*******************************
 * Noise
 ******************************/
 
function startApp() {
    $("#container").append('<div id="loading"><img src="imgs/loader.gif">LOADING</div>');
    loadNoise();
    if(DEBUG) {
        console.log("Origin:",origin);
    }
}

function loadNoise() {
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
    if(DEBUG) {
        console.log("noiseLoaded() :: Noise Loaded...");
    }
    
    /* Add Elements */
    $("#container").append('<div id="video-container"></div>');
    $("#container").append('<div id="link-container">CLICK HERE FOR MORE INFORMATION & TICKETS</div>')
    $("#container").append('<div id="player"></div>');
    $("#container").append('<div id="transparent"></div>');
    $('#video-container').append(noiseImage);
    positionNoise();
    
    /* Add Link */    
    $('#loading').remove();
    
    /* Load Player */
    if(BrowserDetect.OS == 'Mac') {
        if(DEBUG) {
            console.log("Loading Embed Version....");
        }
        loadEmbed();
    } else {
        if(DEBUG) {
            console.log("Loading Iframe Version....");
        }
        loadPlayer();  
    }
}

/******************
 * Load Player
 *****************/

function loadPlayer() {

     if(DEBUG){
         console.log("loadPlayer() :: Loading Player ...");
     }

     $("#container").append('<div id="player"></div>');
     var tag = document.createElement('script');
     tag.src = "//www.youtube.com/iframe_api";
     var firstScriptTag = document.getElementsByTagName('script')[0];
     firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

}
 
function onPlayerReady(event) {
     if(DEBUG) {
         console.log("onPlayerReady(e) :: Calling noise and cueing playlist...",videosDesktop);
     }
     
     player.cuePlaylist(videosDesktop);
     startCheck(); // start timer to check if it its really playing
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
             'origin': origin,
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

function onytplayerStateChange(newState) {   
   switch (newState.data) {
        case 0:
            if(DEBUG) {
                console.log("onytplayerStateChange() :: State",newState.data,"End Playlist");
            }
            window.focus();
            break;
        case 1:
            if(DEBUG) {
                console.log("onytplayerStateChange() :: State",newState.data,"Playing");
                console.log("Playing",player.getPlaylistIndex());
            }
            window.focus();
            break;
        case -1:
            if(DEBUG) {
                console.log("onytplayerStateChange() :: State",newState.data,"Unstarted");
           }
            showNoise();  
            window.focus();
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
  
/******************
 * Embed Player
 *****************/ 

function loadEmbed() {
    if(DEBUG) {
        console.log("loadPlayer() Loading Player...");
    }
    
    var w_width = $(window).width();
    var w_height = $(window).height();
    
    var params = { allowScriptAccess: "always" };
    var atts = { id: "ytPlayer" };
    
    swfobject.embedSWF("http://www.youtube.com/apiplayer?" +
                         "version=3&rel=0&enablejsapi=1&playerapiid=player1&wmode=transparent", 
                         "player", w_width,w_height, "9", null, null, params, atts);
}

function onYouTubePlayerReady(playerId) {
    if(DEBUG) {
        console.debug("onYouTubePlayerReady() Player loaded....",videosDesktop)
    }
    
    player = document.getElementById("ytPlayer");
    player.addEventListener("onStateChange", "onEmbedStateChange");
    player.loadPlaylist(videosDesktop);
    startCheck();
}

function onEmbedStateChange(newState) {   
   switch (newState) {
        case 0:
            if(DEBUG) {
                console.log("onPlayerStateChange() ::",newState,"End Playlist");
            }
            player.playVideoAt(1);
            window.focus();
            break;
        case 1:
            if(DEBUG) {
                console.log("onPlayerStateChange() ::",newState,"Playing");
            }
            window.focus();
            break;
        case -1:
            if(DEBUG) {
                console.log("onPlayerStateChange() ::",newState,"Unstarted");
            }
            showNoise();  
            window.focus();
            break;
        case 2:
            if(DEBUG) {
                console.log("onPlayerStateChange() ::",newState,"Paused");
            }
            window.focus();
            break;
        case 3:
            if(DEBUG) {
                console.log("onPlayerStateChange() ::",newState,"Buffering");
            }
            break;
   }
}

/***************************
 * Interaction
 *************************/

$(document).keypress(function (e){ 
    if(DEBUG) {
        console.log("Spacebar",e,"Skipping....");
    }
    var key;
    if ( $.browser.msie ) {  // if IE it uses keyCode instead of charcode
        key = e.keyCode;
    } else {
        key = e.charCode; // all other (Safari, Chrome, Firefox) use charCode
    }
    
    if(key == 32) {
        showNoise();  
        player.nextVideo();
    } 
});

$(window).resize(function() { 
    if(DEBUG) {
        console.log("Resizing...")
    }
    positionNoise();
    player.width = $(window).width()
    player.height = $(window).height();
});

$(window).focus(function() {
    if(DEBUG) {
        console.log("Window has focus");
    }
});

/***************************
 * Noise
 *************************/
 
function startCheck() {
     if(DEBUG) {
         console.log("startCheck() :: Starting Timer");
     }
     if(!timeron) {
         timer = setInterval('checkPlay()',500);
     }
     timeron = true;
 }

function checkPlay() {
     if(DEBUG) {
         //console.log("checkPlay() :: CurrentTime:",player.getCurrentTime(),"Totaltime",player.getDuration());
     }
     if(player.getCurrentTime() > 0 && player.getCurrentTime() < player.getDuration() - 0.1) {
         hideNoise();
     }
     if(player.getCurrentTime() != 0 && player.getCurrentTime() > player.getDuration() - 0.1) {
         showNoise();
     }
 }
  
function showNoise() {
    if(!noiseon) {
        if(DEBUG) {
            console.log("hidenoise() :: Noise fadein...");
        }
        $("#video-container").fadeIn('fast');
        $("#link-container").css("visibility","hidden");
        noiseon = true;
    }
}

function hideNoise() {
    if(noiseon) {
        if(DEBUG) {
            console.log("hidenoise() :: Noise fadeout...");
        }
        $("#video-container").fadeOut('fast');
        $("#link-container").css("visibility","visible");
        noiseon = false;
    }
}

/***************************
 * Positioning & Resising
 *************************/

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
    $("#link-container").css("visibility","visible");
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