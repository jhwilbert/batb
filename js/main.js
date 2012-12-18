var player;
var fullPlaylist = ['qRBrptVex2I','A1oqJiMczCg','G9aDzKZHRxU','P2uMQOBlk60','IvmIk3LCmwc','mYqAzPs6Lx0'];
var selectedRefereers = ["facebook","blogger","localhost"];
var selectedPlaylist = [];
var videoElement;

/***************/
/*  StartPage  */
/***************/

$(document).ready(function() {
    console.log("Page ready...");
	loadVideo();
});


/***************/
/* Video Loader */
/***************/
                                                                                                                                                                                                                                                                                           
function videoLoaded() {
   console.debug("videoLoaded() :: Video loaded...")
   videoElement.play(); // Start Playing Noise Static
   createPlaylist(ua,checkRefereer()); // Create playlist for Desktop or Mobile
   loadPlayer(); // Start YT player
	
}

function loadVideo() {
	console.debug("loadVideo() :: Loading Static video...");
	$("#video-container").append('<video id="static" width="100%" loop="loop" autobuffer="true"><source src="http://jhwilbert.com/v1/static_5.mp4" type="video/mp4">Your browser does not support the video tag.</video>');
   
	videoElement = document.getElementById("static");
	videoElement.addEventListener('progress',updateLoadingStatus,false);
	videoElement.addEventListener('canplaythrough',videoLoaded,false);
}

function updateLoadingStatus() {
   var loadingStatus = document.getElementById("loading-status");
   var percentLoaded = parseInt(((videoElement.buffered.end(0) / videoElement.duration) * 100));
   loadingStatus.innerHTML =   percentLoaded + '%';
}

function onPlayerReady(event) {
    console.debug("onPlayerReady(e) :: Player ready...");
    // Define Page
    if(ua == 'mobile') {
        startMobilePage();
    } else {
        startDesktopPage();
    }
}

function createPlaylist(ua,refereerListed) {
    console.debug("createPlaylist() :: Playlist Created...", selectedPlaylist,refereerListed); 
    
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

/***********************/
/* Playback Detection */
/***********************/

function detectInterruption(duration,currentTime) {
	if(duration != 0 && currentTime !=0) {
		var percentPlayed = Math.round((currentTime/duration) * 100);
		console.debug("detectInterruption() :: Duration:",duration,"CurrentTime:",currentTime,"PercentPlayed",percentPlayed + "%");
	} else {
		console.debug("detectInterruption() :: Film hasn't started",duration,currentTime);
	}
}


/***************/
/*   Player    */
/***************/

function loadPlayer() {
    console.debug("loadPlayer() :: Loading Player...");

    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	var postContentClr = $("iframe#textarea1IFrame").contents().find("body")
	postContentClr.html("").parent().focus(function() {
		console.debug("focus is on iframe")
	});

	
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
            console.debug("onytplayerStateChange() :: End of playlist");
            $("#player").remove();
            $("#post-player").show();
			window.focus();
            break;
        case 1:
			console.debug("onytplayerStateChange() :: Hiding static");
            debugMsg("Playing",state);
            $("#video-container").hide();
			window.focus();
            break;
        case -1:
			console.debug("onytplayerStateChange() :: Showing static");
            $("#video-container").show();
            debugMsg("Unstarted",state);
			window.focus();
            break;
		case 2:
			console.debug("onytplayerStateChange() :: Paused");
			debugMsg("Paused",state);
			window.focus();
			break;
			
   }
}


$(window).focus(function() {
    console.debug("Window has focus")
});


/************/
/* UTILS    */
/************/

function detectKey(e) {
	e.preventDefault();

    if(e.charCode == 32) {
        player.nextVideo();
		detectInterruption(player.getDuration(),player.getCurrentTime())
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