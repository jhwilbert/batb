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
        $("#statusDesktop").html("Link invalid");
    } else {
        $.get(fullURL).success(function() { addDesktop() }).error(function() { errorDesktop() });
    }
});


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


/*  You Tube Checks  */

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