$(function() {
  $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') 
        && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});

$(document).ready(function() {
  var respmenu = $('#respmenu');
  var menu = $('#nav>ul');
  $(respmenu).on('click', function(e) {
    e.preventDefault();
    menu.slideToggle();
  });
  $(window).resize(function(){
    var ancho = $(window).width();
    if(ancho > 768 && menu.is(':hidden')) {
      menu.removeAttr('style');
    }   
  });
});
