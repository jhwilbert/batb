/**************************************/
/*          Admin Version             */
/**************************************/

var youtubeURL = "https://gdata.youtube.com/feeds/api/videos/"
var formatAPI = "?v=2&alt=json";
var videoURL,order,fullURL;
/*  Button Functionallity  */

$(".removeBtn").click(function() {
    console.log("Remove",this.id);
    var elid = this.id;
    $.post( '/a/remove', { p_id: this.id }).success(function() { 
        $("#item_"+elid).remove();
    });
});

/*  Form Functionallity  */

$("#addForm").submit(function(event) {
    event.preventDefault(); 
    var $form = $( this );
    videoURL = $form.find( 'input[name="url"]' ).val();
    order = $form.find( 'input[name="order"]' ).val();
    fullURL = youtubeURL + videoURL + formatAPI;
    
    if(videoURL == '') {
        $("#replyMsg").html("Link invalid");
    } else {
        $.get(fullURL).success(function() { videoExists() }).error(function() { videoDoesnt() });
    }
});

/*  You Tube Checks  */

function videoExists() {
  $("#replyMsg").html("Video Exists, storing video...");
  $.post( '/a/add', { p_videourl: videoURL, p_order : order }, function(data) {
      $("#replyMsg").html("Data",data);
      window.location.reload();
  });
}

function videoDoesnt() {
  $("#replyMsg").html("Video doesn't exist. Please check link...");
}