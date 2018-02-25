$(document).ready(function(){
    $('.owl-carousel').owlCarousel({
        loop:true,
        margin:30,
        responsiveClass:true,
        nav: true,
        navText: ["<i class='fa fa-angle-left fa-3x'></i>", "<i class='fa fa-angle-right fa-3x'></i>"],
        responsive:{
            0:{
                items:1,
                nav:true,
                loop:true
            },
            600:{
                items:2,
                nav:true,
                loop:true,
                margin: 40
            },
            768:{
                items:3,
                nav:true,
                loop:true
            },
            1200:{
                items:5,
                nav:true,
                loop:true
            }
        }
    })
});
