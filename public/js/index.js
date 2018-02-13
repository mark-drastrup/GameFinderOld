$(document).ready(function(){
  $('.carousel').slick({
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 5
  });

  $('.owl-carousel').owlCarousel({
    loop:true,
    margin:30,
    responsiveClass:true,
    nav: true,
    dots: true,
    responsive:{
        0:{
            items:1,
            nav:true
        },
        600:{
            items:3,
            nav:true
        },
        1000:{
            items:5,
            nav:true,
            loop:true
        }
    }
})

    $('.owl-carousel-result').owlCarousel({
        loop:true,
        margin:30,
        responsiveClass:true,
        nav: true,
        dots: true,
        responsive:{
            0:{
                items:1,
                nav:true
            },
            600:{
                items:3,
                nav:true
            },
            1000:{
                items:5,
                nav:true,
                loop:true
            }
        }
    })
});
