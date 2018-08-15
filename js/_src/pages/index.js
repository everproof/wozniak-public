route('/', function () {
    $(function ($) {
        var $carouselSelectors = $('#carousel-selectors').children();
        var $carousel = $('.carousel').unslider({
            autoplay: true,
            delay: 7000,
            arrows: false,
            nav: false
        });
        setupStartStop($carousel);

        $carouselSelectors.each(function (index) {
            $(this).on('click', function () {
                $carousel.data('unslider').animate(index);
            });
        });

        $carousel.on('unslider.change', function (event, index) {
            $carouselSelectors.removeClass('active');
            $carouselSelectors.eq(index).addClass('active');
        });

        var $clientSuccessCarousel = $('.client-success-carousel').unslider({
            arrows: false,
            autoplay: true,
            delay: 10000
        });
        setupStartStop($clientSuccessCarousel);
    });

    function setupStartStop($carousel) {
        $carousel.on('mouseenter', function () {
            $carousel.data('unslider').stop();
        }).on('mouseleave', function () {
            $carousel.data('unslider').start();
        });
    }
});
