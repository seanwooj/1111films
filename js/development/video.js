// This was derived from this useful article:
// http://zerosixthree.se/create-a-responsive-header-video-with-graceful-degradation/

var headerVideo = (function($, document) {

  var settings = {
    container: $('.header-video'),
    header: $('.header-video--media'),
    videoTrigger: $('#video-trigger'),
    autoPlayVideo: false
  };

  var init = function(options){
    settings = $.extend(settings, options);

    console.log(settings);

    getVideoDetails();
    setFluidContainer();
    bindClickAction();

    if(videoDetails.teaser) {
      appendTeaserVideo();
    }

    if(settings.autoPlayVideo) {
      appendFrame();
    }

  };

  var getVideoDetails = function(){
    videoDetails = {
      id: settings.header.data('video-src'),
      teaser: settings.header.data('teaser-source'),
      provider: settings.header.data('provider'),
      videoHeight: settings.header.data('video-height'),
      videoWidth: settings.header.data('video-width')
    };

    console.log(videoDetails);

    return videoDetails;
  };

  var setFluidContainer = function(){
    // set aspect ratio as vid height / vid width
    var aspectRatio = videoDetails.videoHeight / videoDetails.videoWidth;
    // give the container a data attribute with the aspect ratio
    settings.container.data('aspectRatio', aspectRatio);

    // upon window resize, do the following
    $(window).resize(function(){

      // get the window height and width
      var winWidth = $(window).width(),
          winHeight = $(window).height();

      // set the container width and height based on window size
      // and aspect ratio
      settings.container
        // set the width to equal the window width
        .width(winWidth)
        // set the height to equal the window height * the aspect ratio
        .height(winHeight / settings.container.data('aspectRatio'));

      //  if the window height is less than the container height
      if(winHeight < settings.container.height()) {
        // set container height and width to the window height and width
        settings.container
          .width(winWidth)
          .height(winHeight);
      }

    // trigger the 'resize' event once this is over
    }).trigger('resize');

  };

  var createFrame = function(){

    var html,
        provider = videoDetails.provider,
        id = videoDetails.id;

    if(provider === 'youtube') {
      html = '<iframe id="video-iframe" src="//www.youtube.com/embed/'+id+'?rel=0&hd=1&autohide=1&showinfo=0&autoplay=1&enablejsapi=1&origin=*" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
    } else if (provider === 'vimeo') {
      html = '<iframe id="video-iframe" src="//player.vimeo.com/video/'+id+'?title=0&byline=0&portrait=0&color=3d96d2&autoplay=1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
    } else if (provider === 'html5') {
      html = '<video id="video-iframe" autoplay="true" loop="loop" id="video"><source src="' + id + '.mp4" type="video/mp4"><source src="'+id+'.ogv" type="video/ogg"></video>';
    }

    if(html){
      return html;
    } else {
      console.error("NO HTML TO RETURN!!")
    }

  };

  var appendTeaserVideo = function(){
    if(Modernizr.video && !isMobile()){
      var source = videoDetails.teaser,
          html = '<video autoplay="true" loop="loop" muted id="teaser-video" class="teaser-video"><source src="'+ source + '.mp4" type="video/mp4"><source src="'+source+'.ogv" type="video/ogg"></video>';

      settings.container.append(html);
    }
  };

  var isMobile = function(){
    return Modernizr.touch;
  };

  var appendFrame = function(){
    // hide the header
    settings.header.hide();

    // append the frame that is built when we call createFrame
    settings.container.append(createFrame());
    // hide the teaser video
    $('#teaser-video').hide();

    // if there is a video trigger, hide it.
    if(settings.videoTrigger){
      settings.videoTrigger.fadeOut('slow');
    }
  };

  var bindClickAction = function(){
    settings.videoTrigger.on('click', function(e) {
      e.preventDefault();
      appendFrame();
    });
  };

  return {
    init: init
  };

})(jQuery, document);

$(function(){
  headerVideo.init({
    container: $('.header-video'),
    header: $('.header-video--media'),
    videoTrigger: $("#video-trigger"),
    autoPlayVideo: true
  });
});

