// Custom Script
// Developed by: Samson.Onna
// CopyRights : http://webthemez.com

// preloader
$(window).load(function () {
    $('.preloader').fadeOut(1000); // set duration in brackets    
});

$(function () {
    new WOW().init();
    $('.templatemo-nav').singlePageNav({
        offset: 70,
        filter: ':not([href*=".html"])'
    });

    /* Hide mobile menu after clicking on a link
    -----------------------------------------------*/
    $('.navbar-collapse a:not([onclick])').click(function () {
        $(".navbar-collapse").collapse('hide');
    });
})