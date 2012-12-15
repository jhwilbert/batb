var player;
var full_playlist = ['MYleNL1lKPA','MYleNL1lKPA','MYleNL1lKPA','MYleNL1lKPA','MYleNL1lKPA','MYleNL1lKPA'];
var selected_playlist = [];

/***************/
/*  StartPage  */
/***************/

$(document).ready(function() {    
    switch (ua) {
        case 'mobile':
            console.debug("Mobile Version");
            createPlaylist(ua)
           // mobilePage();
            break;
        case 'desktop':
            console.debug("Desktop Version");
            createPlaylist(ua)
            //desktopPage();
            break;
    }
});

function createPlaylist(ua) {
    if(ua == 'mobile') {
        console.debug("Play single video");
        console.debug(full_playlist,videoId);
    } else {
        console.debug("Play multiple video playlist");
        console.debug(full_playlist);
    }
}

/***************/
/*  StartPage  */
/***************/

function mobilePage() {
    $("#pre-player").show();
    $("#pre-player").click(function() {
        createIframe();
        $("#pre-player").hide();
    });
}

function desktopPage() {
    $("#pre-player").hide();
    createIframe();
}

/***************/
/*   Player    */
/***************/

function createIframe() {
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
        case -1:
            debugMsg("Unstarted",state);
   }
}

function onPlayerReady(event) {
    
    console.debug("Ready Event");
    
    if(typeof(videoId) == 'number' && videoId < playList.length) {
        // Valid video
    } else {
        videoId = 0;
    }
    
	player.loadPlaylist(playList,videoId);
	player.addEventListener("onStateChange", "onytplayerStateChange");
	event.target.playVideo();
}

function detectKey(e) {
    if(e.charCode == 32) {
        player.nextVideo();
    }   
}

function debugMsg(msg) {
    $("#state").html(msg);
    console.debug(msg);
}

/************/
/* UTILS    */
/************/

function viewportSize() {
     var viewportwidth;
     var viewportheight;
    // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
     if (typeof window.innerWidth != 'undefined')
     {
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