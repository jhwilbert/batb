
/****************************************
 *  MOBILE  main_m.js                   *
 ****************************************/
var player;
var textContent = "A Barbican season to celebrate the work and influence of the 20th centuries greatest artist.";
/**
 * Start page defines the start of the application. It gets the videos from
 * the backend, creates the loader and starts the loader of the player.
 */

function startApp() {
    $("#container").append('<div id="header"><img src="../imgs/logo.png"></div>');
    $("#container").append('<div id="player"></div><div id="content">'+textContent+'<br><br><strong>14 Feb-9 Jun 2013</strong></div><div id="button"><a href="http://www.barbican.org.uk/duchamp/">PURCHASE TICKETS</a></div>');
    
    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

}

/**
 * Start page defines the start of the application. It gets the videos from
 * the backend, creates the loader and starts the loader of the player.
 */

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId : videosMobile[0],                    
        playerVars: {  
            'autoplay' : 1,
            'controls' : 0,
            'showinfo' : 0,
            'modestbranding' : 0,
            'rel' : 0
        }
    
    });
}

