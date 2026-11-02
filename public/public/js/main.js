/* --------------------------------- SCROLL TO --------------------------------- */

var SCROLL_SPEED = 600;
var HEADER_OFFSET = 0;
var IS_PROJECTS = true;
var SHOW_MESSAGE = false;
var $topSection = $('#top-section');
var $window = $(window);

function iOS() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
    // iPad on iOS 13 detection
    || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    }

function enterPage() {
  $('html, body').animate({scrollTop: $topSection.height() + 2}, SCROLL_SPEED );
}
function hideTopElement() {
  if ($topSection.length > 0) {
    //$topSection.addClass('d-none');
    $window.scroll(function() {
      var scrollPos = $window.scrollTop();
      var topSectionHeight = $topSection.height();
      if (scrollPos > topSectionHeight && !$topSection.hasClass('visibility-hidden')) {
        $topSection.addClass('visibility-hidden');
        $(window).scroll(checkAndDeleteTopSection);
      }
    });
  }
}

function checkAndDeleteTopSection() {
  var topSectionHeight = $topSection.height();
  if ($topSection.length > 0) {
    if($(window).scrollTop() <= topSectionHeight) {
      $(document).scrollTop(0);
      $topSection.remove();
      $(document).scrollTop(0);
      $(window).unbind('scroll');
    }
  }
}

$('.transparent-link').on('click', function(e) {
  if(e.target.id == "base") {
    var target = $(this).data('target');
    backToProjects(target);  
  }
});

$('.to-top').on('click', function(e) {
  e.preventDefault();
  e.stopPropagation();
  scrollToProjects(); 
});

function scrollToProjects(){
  $('html, body').animate({scrollTop: 0}, SCROLL_SPEED );
}

if (document.getElementById("message") && 
    document.getElementById("toparrow") ){
  
  if (document.getElementById("message").innerText.length > 0){
    SHOW_MESSAGE = true;
    placeArrowDown();
  }
  else{
    SHOW_MESSAGE = false;
    document.getElementById("message").style.display = "none";
  }
}

function placeArrowDown(){
  if (document.getElementById("top-section")){
    
    if(iOS()) {
      $('#top-section').height(window.innerHeight);
    }
    
    // Base height
    var height = 20;
    
    if (document.getElementById("message") && document.getElementById("message").style.display === 'block'){
      
      height += document.getElementById("message").offsetHeight;
      
    }
    
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      //height += 70;
    }
    
    
    document.getElementById("toparrow").style.bottom = String(height) + "px";
    
  }
}


function closeMessage(){  
  
  var time = (new Date()).toISOString();
  sessionStorage.setItem('stampMsg', time);
  
  hideMessage();
  
}

function hideMessage(){
  SHOW_MESSAGE = false;
  
  if (document.getElementById("message")){
    document.getElementById("message").style.display= "none";
  }
  if (document.getElementById("toparrow")){
    placeArrowDown();
  }
}

function showMessage(){
  
  placeArrowDown();
  
  SHOW_MESSAGE = true;
  
  if (document.getElementById("message")){
    
    document.getElementById("message").style.display= "block";
    
  }
}



window.addEventListener('scroll', function(e) {
  
  if (document.getElementById("toparrow")){
    
    last_known_scroll_position = window.scrollY;
    
    document.getElementById("toparrow").style.opacity = 1-0.01*last_known_scroll_position;
  }
});




function backToProjects(id){
  if (id){
    toUrl('/projekte/#'+id);
  }
  else{
    location.href = '/projekte';
  }
}

function toUrl(url){
  if (SHOW_MESSAGE){
    location.href = url;
  }
  else
  {
    location.href = url;
  }
}

function switchPageAndScrollToAnchor(id){
  location.href = '/buero#'+id;
}

function scrollToAnchor(id){
  if(id === "") return;
    var target = getAnchor(id);
  
  if(target.length > 0){
    $('html, body').animate({scrollTop: target .offset().top - HEADER_OFFSET}, SCROLL_SPEED).promise().then(function() {
      window.location.hash = id;
    });
  }
}

function initScrollLink(){
  $(".scroll-link").click(function(e) {
    var root = window.location.href.split('#');
    var paths = $(this).attr('href').split("#");
    if(paths.length == 2 && getAnchor(paths[1]).length > 0 && root[0] === paths[0]){
      scrollToAnchor(paths[1]);
      e.preventDefault();
      return false;
    }
  });
}

function getAnchor(id){
  return $('[data-id="' + id + '"]');
}

/* --------------------------------- FONT --------------------------------- */

var MTUserId='4b27e7da-fd66-46f7-b95b-f2d643058caa';
var MTFontIds = new Array();

MTFontIds.push("5332178"); // Neufville Futura® W05 Demibold 
MTFontIds.push("5351179"); // Neufville Futura® W05 Medium 
(function() {
  var mtTracking = document.createElement('script');
  mtTracking.type='text/javascript';
  mtTracking.async='true';
  mtTracking.src='/public/fonts/mtiFontTrackingCode.js';
  
  (document.getElementsByTagName('head')[0]||document.getElementsByTagName('body')[0]).appendChild(mtTracking);
})();



/* --------------------------------- SLIDE NAV --------------------------------- */

function initSlideNav(){
  $('.hamburger').on('click', function(event) {
    event.preventDefault();
    $('header').toggleClass("open");
    $('#slide_content').toggleClass("open");
    $('#slide_nav').toggleClass("open");
    $('.hamburger').toggleClass("hamburger--arrow");
    return false;
  });
}

function initPeopleOverlay() {
  if ($('html').hasClass('touch')) {
    $('.team-member img').on('click',function() {
      $(this).parent().find('.overlay').addClass('visible');
    });
    $('.team-member .overlay').on('click',function() {
      $(this).removeClass('visible');
    });
  }
}

/* --------------------------------- ON LOAD --------------------------------- */
$(window).on('load', function() {
  
  // init Scroll Link
  initScrollLink();
  
  var now = new Date();
  var msgt = new Date(sessionStorage.getItem('stampMsg'));
  
  if (Math.abs(now-msgt) > 1800000 || !msgt){
    showMessage();
    placeArrowDown();
  }
  
  placeArrowDown();
  
  // init Slide nav
  initSlideNav();
  
  // Scroll on load
  scrollToAnchor(window.location.hash.replace('#', ''));
  
  hideTopElement();
  
  initPeopleOverlay();
});