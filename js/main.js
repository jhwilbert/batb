var player;
var fullPlaylist = ['acvIVA9-FMQ','MYleNL1lKPA','7CFQY0Yf1iI','MYleNL1lKPA','7CFQY0Yf1iI','MYleNL1lKPA'];
var selectedPlaylist = [];

/***************/
/*  StartPage  */
/***************/

$(document).ready(function() {
    // Load Player
    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

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

/*

function createPlaylist(ua) {
    if(ua == 'mobile') {
        selectedPlaylist[0] = fullPlaylist[videoId];
        
        console.debug("Mobile: play single video",selectedPlaylist);
        startMobilePage(); // Start the page and add player
    } else {
        selectedPlaylist = fullPlaylist.splice(videoId,fullPlaylist.length);
        console.debug("Desktop: play all videos",selectedPlaylist);
        startDesktopPage(); // Start the page and add player
    }
}

*/

function startMobilePage() {
    console.debug("Displaying Mobile Version");
    
    $("#pre-player").show();
    $("#pre-player").click(function() {
        player.loadVideoById('MYleNL1lKPA',0);
        $("#pre-player").hide();
        $("#player").show();   
    });
}

function startDesktopPage() {
    console.debug("Displaying Desktop Version");
    $("#pre-player").hide();
    player.loadVideoById('acvIVA9-FMQ',0);
    $("#player").show();   

}

/***************/
/*   Player    */
/***************/

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
            setTimeout(function(){
                $("#overlay").hide();
            },400)
            break;
        case -1:
            //$("#overlay").show();
            debugMsg("Unstarted",state);
            break;
   }
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