var player;
var fullPlaylist = ['qRBrptVex2I','A1oqJiMczCg','G9aDzKZHRxU','P2uMQOBlk60','IvmIk3LCmwc','mYqAzPs6Lx0'];
var selectedRefereers = ["facebook","blogger","localhost"];
var selectedPlaylist = [];

/***************/
/*  StartPage  */
/***************/

$(document).ready(function() {
    console.log("Page ready...");
    createPlaylist(ua,checkRefereer()); // create playlist for Desktop or Mobile
    loadPlayer(); // Start YT player
});

function onPlayerReady(event) {
    console.debug("Player ready...");
    
    // Define Page
    if(ua == 'mobile') {
        startMobilePage();
    } else {
        startDesktopPage();
    }
}

function createPlaylist(ua,refereerListed) {
    console.debug("Playlist Created...", selectedPlaylist,refereerListed); 
    
    // Create playlist based on device
    if(ua == 'mobile') {
        selectedPlaylist[0] = fullPlaylist[videoId];        
    } else {
        selectedPlaylist = fullPlaylist.splice(videoId,fullPlaylist.length);
    }
}

function startMobilePage() {
    console.debug("Displaying Mobile Version");
    $("#pre-player").show();
    
    $("#pre-player").click(function() { // add click
        player.loadPlaylist(selectedPlaylist,0);
        $("#pre-player").hide();   
    });
}

function startDesktopPage() {
    console.debug("Displaying Desktop Version");

    player.loadPlaylist(selectedPlaylist,0);
        
    $("#video-container").append('<video id="static" width="100%" loop="loop" autobuffer="true" autoplay><source src="http://jhwilbert.com/v1/static_5.mp4" type="video/mp4" >Your browser does not support the video tag.</video>');
    $("#pre-player").hide();
}

/***********************/
/*  Refereer Deection  */
/***********************/

function checkRefereer() {
    if(document.referrer != "" && refereerListed()) {
        console.debug("Page has refeer and is listed - return...");
        return 1;
    } else if (document.referrer != "" && !refereerListed()) {
        console.debug("Page has refeer and is not listed...",document.referrer);
    } else {
        console.debug("Page has no refreeer...");
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
    return false
}

/***************/
/*   Player    */
/***************/

function loadPlayer() {
    console.debug("Loading Player...")
    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
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
            console.debug("End of playlist");
            $("#player").remove();
            $("#post-player").show();
            break;
        case 1:
            debugMsg("Playing",state);
            $("#static").hide();
            break;
        case -1:
            $("#static").show();
            debugMsg("Unstarted",state);
            break;
   }
}


/************/
/* UTILS    */
/************/

function detectKey(e) {
    if(e.charCode == 32) {
        player.nextVideo();
    }   
}

function debugMsg(msg) {
    $("#state").html(msg);
    console.debug(msg);
}

function viewportSize() {
     var viewportwidth;
     var viewportheight;
    // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
     if (typeof window.innerWidth != 'undefined') {
          viewportwidth = window.innerWidth,
          viewportheight = window.innerHeight
     }
    // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
     else if (typeof document.documentElement != 'undefined'
         && typeof document.documentElement.clientWidth !=
         'undefined' && document.documentElement.clientWidth != 0)
     {
           viewportwidth = document.documentElement.clientWidth,
           viewportheight = document.documentElement.clientHeight
     }
     // older versions of IE
     else
     {
           viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
           viewportheight = document.getElementsByTagName('body')[0].clientHeight
     }
    
    return { w : viewportwidth, h : viewportheight }
}