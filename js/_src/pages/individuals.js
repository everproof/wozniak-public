route('/individuals/', function () {
    $(function ($) {
        var youtubeVideo = null;

        window.onYouTubeIframeAPIReady = function () {
            youtubeVideo = new YT.Player('individuals-video');
        };

        $('.video .video-play').on('click', function () {
            $(this).parent().addClass('show-video');

            if (youtubeVideo) {
                youtubeVideo.playVideo();
            }
        });
    });
});
