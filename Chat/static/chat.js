$(document).on("ready", function(){
  /* make side menu show up */
  $(".trigger").on("click", function(){
      $(".overlay, .menuWrap").fadeIn(180);
      $(".menu").animate({opacity: '1', left: '0px'}, 180);
  });
  
  /* make config menu show up 
  $(".settings").on("click", function(){
      $(".config").animate({opacity: '1', right: '0px'}, 180);
    /* hide others 
      $(".menuWrap").fadeOut(180);
      $(".menu").animate({opacity: '0', left: '-320px'}, 180);
  });
  */


  // Show/Hide the other notification options
  $(".deskNotif").on("click",function(){
      $(".showSName, .showPreview, .playSounds").toggle();
  });

  /* close all overlay elements */
  $(".overlay").on("click",function () {
      $(".overlay, .menuWrap").fadeOut(180);
      $(".menu").animate({opacity: '0', left: '-320px'}, 180);
      $(".config").animate({opacity: '0', right: '-200vw'}, 180);
  });
  
  //This also hide everything, but when people press ESC
  $(document).on("keydown", function(e) {
     if (e.keyCode == 27) {
      $(".overlay, .menuWrap").fadeOut(180);
      $(".menu").animate({opacity: '0', left: '-320px'}, 180);
      $(".config").animate({opacity: '0', right: '-200vw'}, 180);
    }
});

/* small conversation menu */
$(".otherOptions").on("click", function(){
  $(".moreMenu").slideToggle("fast");
});

/* clicking the search button from the conversation focus the search bar outside it, as on desktop */
$( ".search" ).on("click", function() {
  $( ".searchChats" ).focus();
});
});