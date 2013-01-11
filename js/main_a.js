
/**************************************/
/*          Admin Version             */
/**************************************/

var youtubeURL = "https://gdata.youtube.com/feeds/api/videos/"
var formatAPI = "?v=2&alt=json";
var videoURL,order,fullURL;

$(document).ready(function() {
    
    /*  Button Functionallity  */
    $(".removeBtn").click(function() {
        console.log("Remove",this.id);
        var elid = this.id;
        $.post( '/a/remove', { p_id: this.id }).success(function() { 
            $("#item_"+elid).remove();
        });
    });
    
    /*  Desktop Form Functionallity  */
    $("#addForm").submit(function(event) {
        event.preventDefault(); 
        var $form = $( this );
        videoURL = $form.find( 'input[name="url"]' ).val();
        order = $form.find( 'input[name="order"]' ).val();
        fullURL = youtubeURL + videoURL + formatAPI;

        if(videoURL == '') {
            $("#statusDesktop").html("Link invalid");
        } else {
            $.get(fullURL).success(function() { addDesktop() }).error(function() { errorDesktop() });
        }
    });

    /*  Desktop Form Functionallity  */
    $("#updateForm").submit(function(event) {
        event.preventDefault(); 
        var $form = $( this );
        videoURL = $form.find( 'input[name="url"]' ).val();
        fullURL = youtubeURL + videoURL + formatAPI;

        if(videoURL == '') {
            $("#statusMobile").html("Link invalid");
        } else {
            $.get(fullURL).success(function() { addMobile() }).error(function() { errorMobile() });
        }
    });
    
}); /* End of jQuery Ready */


/*  Form & YouTube Checks  */
function addDesktop() {
  $("#statusDesktop").html("Video Exists, storing video...");
  $.post( '/a/add', { p_videourl: videoURL, p_order : order }, function(data) {
      $("#statusDesktop").html("Data",data);
      window.location.reload();
  });
}

function addMobile() {
  $("#statusMobile").html("Video Exists, storing video...");
  $.post( '/a/update', { p_videourl: videoURL }, function(data) {
      $("#statusMobile").html("Data",data);
      window.location.reload();
  });
}

function errorMobile() {
  $("#statusMobile").html("Video doesn't exist. Please check link...");
}

function errorDesktop() {
  $("#statusDesktop").html("Video doesn't exist. Please check link...");
}

/* YouTube Calls */
function displayInfo(id,url) {
    var videoInfoUrl = youtubeURL + url + formatAPI;
    var title,thumb;
    $.getJSON(videoInfoUrl, function(data) {
        title = data.entry.title.$t;
        thumb = data.entry.media$group.media$thumbnail[0].url;
        console.debug(title,thumb)
        console.debug()
        $("#"+id).append("<img class='v-thumb' src='"+thumb+"'>");
        $("#"+id).append("<div class='v-title'>"+title+"</div>");
        $("#"+id).append("<div class='v-url'><a href='http://www.youtube.com/watch?v="+url+"' target='_blank'>http://www.youtube.com/watch?v="+url+"</a></div>");
    });
}