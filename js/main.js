var player;
var videos = ['jaf6zF-FJBk','MYleNL1lKPA','Pbgr74yNM7M','MYleNL1lKPA','lmag4vL7hnQ','MYleNL1lKPA','mf2pF5oMdP4'];

// Iframe API
var tag = document.createElement('script');
tag.src = "//www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

document.onmousedown = preventClick;

function preventClick(e) {
    console.debug(e);
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

function onPlayerReady(event) {
    if(typeof(videoId) == 'number' && videoId < videos.length) {
        // Valid video
    } else {
        videoId = 0;
    }
	player.loadPlaylist(videos,videoId);
	event.target.playVideo();
}

function detectKey(e) {
    if(e.charCode == 32) {
        player.nextVideo();
    }   
}


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